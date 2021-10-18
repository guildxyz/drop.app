import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import { useCallback, useState } from "react"
import AIRDROP_ABI from "static/abis/airdrop.json"
import TransactionError from "utils/errors/TransactionError"
import useContract from "./useContract"

export enum AirdropAddresses {
  GOERLI = "0xb33F85251De73bAd4343080d6D6266fA88f5117f",
}

type NFTData = {
  name: string
  symbol: string
}

export type Drop = {
  serverId: string
  roleIds: string[]
  tokenAddress: string
  name: string
  id?: number
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

  const dropNamesById = useCallback(
    (id: number): Promise<string> => contract.dropnamesById(id),
    [contract]
  )

  const getDataOfDrop = useCallback(
    (name: string): Promise<Drop> => contract.getDataOfDrop(name),
    [contract]
  )

  const numOfDrops = useCallback(
    (): Promise<number> => contract.numOfDrops(),
    [contract]
  )

  const contractsByDeployer = useCallback(
    (address: string, index: number): Promise<string> =>
      contract.contractsByDeployer(address, index),
    [contract]
  )

  const deployTokenContract = useCallback(
    async (tokenName: string, tokenSymbol: string): Promise<number> => {
      const tx = await contract.deployTokenContract(tokenName, tokenSymbol)
      await tx.wait()
      const numOfContracts = await numOfDeployedContracts(account)
      return numOfContracts
    },
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
        ).then((_) => +_ - 1)

        const { signature } = await fetch("/api/get-signature/start-airdrop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serverId,
            address: account,
            chainId,
            name: dropName,
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
          console.log({
            signature,
            dropName,
            serverId,
            roles: roles.map((roleId) => ({
              roleId,
              tokenImageHash:
                hashes[roleId] || process.env.NEXT_PUBLIC_DEFAULT_IMAGE_HASH,
              tokenName: assetData.name,
              traitTypes: [],
              values: [],
            })),
            contractId,
            channelId,
          })
          const tx = await contract.newAirdrop(
            signature,
            dropName,
            serverId,
            roles.map((roleId) => ({
              roleId,
              tokenImageHash:
                hashes[roleId] || process.env.NEXT_PUBLIC_DEFAULT_IMAGE_HASH,
              tokenName: assetData.name,
              traitTypes: [],
              values: [],
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

  const claim = useCallback(
    (roleId: string, serverId: string, tokenAddress: string) => async () => {
      const { signature } = await fetch("/api/get-signature/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chainId,
          roleId,
          serverId,
          address: account,
          tokenAddress,
        }),
      }).then((response) =>
        response.json().then((body) => {
          if (response.ok) return body
          throw new Error(JSON.stringify(body.errors))
        })
      )

      try {
        const tx = await contract.claim(signature, serverId, roleId, tokenAddress)
        await tx.wait()
        return tx
      } catch (error) {
        console.error(error)
        throw new TransactionError("Failed to claim NFT.")
      }
    },
    [contract, chainId]
  )

  const claims = useCallback(
    (
      address: string,
      serverId: string,
      roleId: string,
      tokenAddress: string
    ): Promise<{ claimed: boolean; approved: boolean }> =>
      contract
        .claims(address, serverId, roleId, tokenAddress)
        .then(([claimed, approved]) => ({ claimed, approved }))
        .catch(() => {
          throw new TransactionError("Failed to read claimed NFTs")
        }),
    [contract]
  )

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
    numOfDeployedContracts,
    numOfDrops,
    dropNamesById,
    getDataOfDrop,
    claim,
    claims,
    uploadedImages /* , imageOfRole, stopAirdrop */,
  }
}

export default useAirdrop
