import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import { useCallback, useState } from "react"
import AIRDROP_ABI from "static/abis/airdrop.json"
import ROLE_TOKEN_ABI from "static/abis/roletoken.json"
import BackendError from "utils/errors/BackendError"
import TransactionError from "utils/errors/TransactionError"
import useContract from "../useContract"

export enum AirdropAddresses {
  GOERLI = "0xb503D6f75F0c9A6110B22E434849257127266e44",
  POLYGON = "0x18Bb4142B25d39d07b0dd1aAF317D6A963AFdAA8",
}

export type Drop = {
  serverId: string
  roleIds: string[]
  tokenAddress: string
  name: string
  id?: number
}

const uploadImages = async (
  images: Record<string, File>,
  serverId: string,
  tokenAddress: string
) => {
  const formData = new FormData()
  Object.entries(images).forEach(([id, image]) =>
    formData.append(
      `${serverId}-${id}-${tokenAddress}.png`,
      image,
      `${serverId}-${id}-${tokenAddress}.${image.name.split(".").pop()}`
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
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const contract = useContract(AirdropAddresses[Chains[chainId]], AIRDROP_ABI, true)

  const numOfDeployedContracts = useCallback(
    (address: string): Promise<BigNumber> =>
      contract.numOfDeployedContracts(address),
    [contract]
  )

  const dropNamesById = useCallback(
    (id: number): Promise<string> => contract.dropnamesById(id),
    [contract]
  )

  const getDataOfDrop = useCallback(
    (name: string): Promise<Drop> =>
      contract.getDataOfDrop(name).then(([serverId, roleIds, tokenAddress]) => ({
        serverId,
        roleIds,
        tokenAddress,
      })),
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
    async (
      tokenName: string,
      tokenSymbol: string
    ): Promise<{ contractId: number; tokenAddress: string }> => {
      const tx = await contract.deployTokenContract(tokenName, tokenSymbol)
      await tx.wait()
      const numOfContracts = await numOfDeployedContracts(account)
      const contractId = +numOfContracts - 1
      const tokenAddress = await contractsByDeployer(account, contractId)
      return {
        contractId,
        tokenAddress,
      }
    },
    [contract, account]
  )

  const deployedTokens = useCallback(
    async (address: string) => {
      const numberOfTokens = await contract.numOfDeployedContracts(address)
      const tokenAddresses = await Promise.all(
        [...Array(+numberOfTokens)].map((_, index) =>
          contract.contractsByDeployer(address, index)
        )
      )
      return tokenAddresses
    },
    [contract]
  )

  const startAirdrop = useCallback(
    async (
      dropName: string,
      channelId: string,
      roles: Record<
        string,
        {
          image: FileList
          ipfsHash: string
          traits: Record<string, string>
        }
      >,
      serverId: string,
      assetType: string,
      contractId: string,
      metaDataKeys: Record<string, string>
    ) => {
      if (contractId === "DEPLOY") throw new Error("Invalid token contract")

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
          throw new BackendError(JSON.stringify(body.errors))
        })
      )

      const tokenAddress = await contractsByDeployer(account, +contractId)
      const tokenContract = new Contract(tokenAddress, ROLE_TOKEN_ABI, library)
      const assetData = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
      ]).then(([name, symbol]) => ({ name, symbol }))

      const imagesToUpload = Object.fromEntries(
        Object.entries(roles)
          .filter(
            ([, { ipfsHash, image }]) => ipfsHash.length <= 0 && image.length > 0
          )
          .map(
            ([
              roleId,
              {
                image: [image],
              },
            ]) => [roleId, image]
          )
      )

      const hashes = Object.keys(imagesToUpload).length
        ? await uploadImages(imagesToUpload, serverId, tokenAddress)
        : {}

      // Append inputted ipfs hashes to the uploaded ones
      Object.entries(roles)
        .filter(([, { ipfsHash }]) => ipfsHash.length > 0)
        .forEach(([roleId, { ipfsHash }]) => (hashes[roleId] = ipfsHash))

      // Append the default hash for the rest of the roles
      Object.entries(roles)
        .filter(
          ([, { ipfsHash, image }]) => ipfsHash.length <= 0 && image.length <= 0
        )
        .map(
          ([roleId]) => (hashes[roleId] = process.env.NEXT_PUBLIC_DEFAULT_IMAGE_HASH)
        )

      setUploadedImages(hashes)

      try {
        console.log({
          signature,
          dropName,
          serverId,
          roles: Object.entries(roles).map(([roleId, { traits }]) => ({
            roleId,
            tokenImageHash: hashes[roleId],
            NFTName: assetData.name,
            traitTypes: Object.keys(traits ?? {}).map(
              (traitKey) => metaDataKeys[traitKey]
            ),
            values: Object.values(traits ?? {}),
          })),
          contractId: +contractId,
          channelId,
        })
        const tx = await contract.newAirdrop(
          signature,
          dropName,
          serverId,
          Object.entries(roles).map(([roleId, { traits }]) => ({
            roleId,
            tokenImageHash: hashes[roleId],
            NFTName: assetData.name,
            traitTypes: Object.keys(traits ?? {}).map(
              (traitKey) => metaDataKeys[traitKey]
            ),
            values: Object.values(traits ?? {}),
          })),
          +contractId,
          channelId
        )
        await tx.wait()
        return contractId
      } catch (e) {
        console.error(e)
        throw new TransactionError("Failed to start airdrop.")
      }
    },
    [contract, chainId, account]
  )

  const claim = useCallback(
    async (roleId: string, serverId: string, tokenAddress: string) => {
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
    [contract, chainId, account]
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

  const claimables = useCallback(
    (
      serverId: string,
      roleId: string,
      tokenAddress: string
    ): Promise<{ active: boolean; dropped: boolean }> =>
      contract
        .claimables(serverId, roleId, tokenAddress)
        .then(([active, dropped]) => ({ active, dropped }))
        .catch(() => {
          throw new TransactionError("Failed to read claimable NFTs")
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

  const stopAirdrop = useCallback(
    (serverId: string, roleId: string, contractId: string) => async () => {
      const numberOfTokens = await contract.numOfDeployedContracts(account)
      if (+contractId >= numberOfTokens) throw new Error("Invalid token contract")

      const tokenAddress = await contractsByDeployer(account, +contractId)

      const { signature } = await fetch("/api/get-signature/stop-airdrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chainId,
          serverId,
          address: account,
          roleId,
          tokenAddress,
        }),
      }).then((response) =>
        response.json().then((body) => {
          if (response.ok) return body
          throw new Error(JSON.stringify(body.errors))
        })
      )

      try {
        const tx = await contract.stopAirdrop(
          signature,
          serverId,
          roleId,
          +contractId
        )
        await tx.wait()
        return tx
      } catch {
        throw new TransactionError("Failed to stop airdrop.")
      }
    },
    [contract, chainId, account]
  )

  const grant = useCallback(
    (
        serverId: string,
        roleId: string,
        contractId: string,
        recieverAddress: string
      ) =>
      async () => {
        const numberOfTokens = await contract.numOfDeployedContracts(account)
        if (+contractId >= numberOfTokens) throw new Error("Invalid token contract")

        const tokenAddress = await contractsByDeployer(account, +contractId)

        const { signature } = await fetch("/api/get-signature/grant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chainId,
            serverId,
            address: account,
            roleId,
            tokenAddress,
            recieverAddress,
          }),
        }).then((response) =>
          response.json().then((body) => {
            if (response.ok) return body
            throw new Error(JSON.stringify(body.errors))
          })
        )

        try {
          const tx = await contract.grant(
            signature,
            serverId,
            roleId,
            recieverAddress,
            +contractId
          )
          await tx.wait()
          return tx
        } catch {
          throw new TransactionError("Failed to grant token.")
        }
      },
    [contract, chainId, account]
  )

  return {
    startAirdrop,
    contractsByDeployer,
    numOfDeployedContracts,
    numOfDrops,
    dropNamesById,
    getDataOfDrop,
    claim,
    claims,
    deployedTokens,
    deployTokenContract,
    claimables,
    stopAirdrop,
    grant,
    uploadedImages,
  }
}

export default useAirdrop
