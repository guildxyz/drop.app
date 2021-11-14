import { Contract } from "@ethersproject/contracts"
import {
  JsonRpcSigner,
  Provider,
  TransactionReceipt,
} from "@ethersproject/providers"
import { StartAirdropData } from "hooks/machines/useStartAirdropMachine"
import ROLE_TOKEN_ABI from "static/abis/roletoken.json"
import TransactionError from "utils/errors/TransactionError"
import { contractsByDeployer, startAirdrop as airdropStartAirdrop } from "./airdrop"
import startAirdropSignature from "./utils/signatures/startAirdrop"
import uploadImages from "./utils/uploadImages"

const startAirdrop = async (
  chainId: number,
  account: string,
  signer: JsonRpcSigner,
  data: StartAirdropData,
  provider?: Provider,
  setUploadedImages?: (hashes: Record<string, string>) => void
): Promise<TransactionReceipt> => {
  const { contractId, serverId, name, roles: rolesObject, channel, urlName } = data
  const roles = Object.entries(rolesObject)
  if (contractId === "DEPLOY") throw new Error("Invalid token contract")

  const [signature, tokenAddress] = await Promise.all([
    startAirdropSignature(serverId, account, chainId, urlName),
    contractsByDeployer(chainId, account, +contractId, provider),
  ])

  const tokenContract = new Contract(tokenAddress, ROLE_TOKEN_ABI, signer)
  const assetData = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
  ]).then(([tokenName, symbol]) => ({ name: tokenName, symbol }))

  const imagesToUpload = Object.fromEntries(
    roles
      .filter(([, { ipfsHash, image }]) => ipfsHash.length <= 0 && image.length > 0)
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
  roles
    .filter(([, { ipfsHash }]) => ipfsHash.length > 0)
    .forEach(([roleId, { ipfsHash }]) => (hashes[roleId] = ipfsHash))

  // Append the default hash for the rest of the roles
  roles
    .filter(([, { ipfsHash, image }]) => ipfsHash.length <= 0 && image.length <= 0)
    .map(([roleId]) => (hashes[roleId] = process.env.NEXT_PUBLIC_DEFAULT_IMAGE_HASH))

  if (!!setUploadedImages) setUploadedImages(hashes)

  try {
    const tx = await airdropStartAirdrop(
      chainId,
      signer,
      signature,
      urlName,
      name,
      serverId,
      roles.map(([roleId, { traits, traitKeyIds }]) => ({
        roleId,
        tokenImageHash: hashes[roleId],
        NFTName: assetData.name,
        traitTypes: Object.keys(traits ?? {}).map(
          (traitKey) => traitKeyIds[traitKey]
        ),
        values: Object.values(traits ?? {}),
      })),
      +contractId,
      channel,
      provider
    )
    const receipt = await tx.wait()
    return receipt
  } catch (error) {
    console.error(error)
    throw new TransactionError("Failed to start airdrop.")
  }
}

export default startAirdrop
