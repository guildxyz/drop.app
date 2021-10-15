import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import { useCallback, useState } from "react"
import AIRDROP_ABI from "static/abis/airdrop.json"
import TransactionError from "utils/errors/TransactionError"
import useContract from "./useContract"

export enum AirdropAddresses {
  GOERLI = "0xdeDbEF6cFAFd6e3BaA28eB2F943e187983b240ea",
}

type NFTData = {
  name: string
  symbol: string
}

const uploadImages = async (images: Record<string, File>, serverId: string) => {
  const formData = new FormData()
  Object.entries(images).forEach(([id, image]) =>
    formData.append(
      `${serverId}-${id}.png`,
      image,
      `${serverId}-${id}.${image.name.split(".").pop()}`
    )
  )
  const hashes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/uploadImages`, {
    method: "POST",
    body: formData,
  }).then((res) => (res.ok ? res.json() : Promise.reject()))
  return hashes
}

const useAirdrop = () => {
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({})
  const { chainId, account } = useWeb3React()
  const contract = useContract(AirdropAddresses[Chains[chainId]], AIRDROP_ABI, true)

  const numOfDeployedContracts = useCallback(
    (address: string): Promise<number> => contract.numOfDeployedContracts(address),
    [contract]
  )

  const contractsByDeployer = useCallback(
    (address: string, index: number): Promise<string> =>
      contract.contractsByDeployer(address, index),
    [contract]
  )

  const deployTokenContract = useCallback(
    async (tokenName: string, tokenSymbol: string): Promise<number> =>
      contract
        .deployTokenContract(tokenName, tokenSymbol)
        .then(() => numOfDeployedContracts(account)),
    [contract, account]
  )

  const startAirdrop = useCallback(
    (
        dropName: string,
        channelId: string,
        roles: string[],
        serverId: string,
        images: Record<string, File>,
        inputHashes: Record<string, string>,
        assetType: string,
        assetData: NFTData
      ) =>
      async () => {
        if (assetType !== "NFT") throw new Error("Asset type not implemented")

        const contractId = await deployTokenContract(
          assetData.name,
          assetData.symbol
        )

        const { signature } = await fetch("/api/get-signature/start-airdrop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serverId,
            address: account,
            chainId,
          }),
        }).then((response) =>
          response.json().then((body) => {
            if (response.ok) return body
            throw new Error(JSON.stringify(body.errors))
          })
        )

        const hashes = Object.keys(images).length
          ? await uploadImages(images, serverId)
          : {}

        setUploadedImages({
          ...hashes,
          ...Object.fromEntries(
            roles
              .filter((id) => !hashes[id]?.length)
              .map((id) => [
                id,
                inputHashes[id] || process.env.NEXT_PUBLIC_DEFAULT_IMAGE_HASH,
              ])
          ),
        })

        try {
          const tx = await contract.newAirdrop(
            signature,
            dropName,
            serverId,
            roles.map((roleId) => ({
              roleId,
              tokenImageHash:
                hashes[roleId] || process.env.NEXT_PUBLIC_DEFAULT_IMAGE_HASH,
            })),
            contractId,
            channelId
          )
          await tx.wait()
          return contractId
        } catch {
          throw new TransactionError("Failed to start airdrop.")
        }
      },
    [contract, chainId]
  )

  /* const claim = useCallback(
    (roleId: string, serverId: string) => async () => {
      const { signature } = await fetch("/api/get-signature/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, roleId, serverId, address: account }),
      }).then((response) =>
        response.json().then((body) => {
          if (response.ok) return body
          throw new Error(JSON.stringify(body.errors))
        })
      )

      try {
        const tx = await contract.claim(signature, serverId, roleId)
        await tx.wait()
        return tx
      } catch {
        throw new TransactionError("Failed to claim NFT.")
      }
    },
    [contract, chainId]
  ) */

  /* const claims = useCallback(
    (
      serverId: string,
      roleId: string,
      address: string
    ): Promise<[boolean, boolean]> =>
      contract.claims(address, serverId, roleId).catch(() => {
        throw new TransactionError("Failed to read claimed NFTs")
      }),
    [contract]
  ) */

  /* const imageOfRole = useCallback(
    (serverId: string, roleId: string): Promise<[boolean, string]> =>
      contract.imageOfRole(serverId, roleId).catch(() => {
        throw new TransactionError("Failed to read NFT images")
      }),
    [contract]
  ) */

  /* const stopAirdrop = useCallback(
    (serverId: string, roleIds: string[]) => async () => {
      const { signature } = await fetch("/api/get-signature/stop-airdrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, serverId, address: account, roleIds }),
      }).then((response) =>
        response.json().then((body) => {
          if (response.ok) return body
          throw new Error(JSON.stringify(body.errors))
        })
      )

      try {
        const tx = await contract.stopAirdrop(signature, serverId, roleIds)
        await tx.wait()
        return tx
      } catch {
        throw new TransactionError("Failed to stop airdrop.")
      }
    },
    [contract, chainId]
  ) */

  return {
    startAirdrop,
    contractsByDeployer,
    uploadedImages /* , claim, claims, imageOfRole, stopAirdrop */,
  }
}

export default useAirdrop
