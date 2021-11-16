import {
  JsonRpcSigner,
  Provider,
  TransactionReceipt,
} from "@ethersproject/providers"
import { StartAirdropData } from "hooks/machines/useStartAirdropMachine"
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

  const imagesToUpload = Object.fromEntries(
    roles
      .filter(([, { image }]) => image.length > 0)
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

  // Append the default hash for the roles withour uploaded image
  roles
    .filter(([, { image }]) => image.length <= 0)
    .forEach(
      ([roleId]) => (hashes[roleId] = process.env.NEXT_PUBLIC_DEFAULT_IMAGE_HASH)
    )

  if (!!setUploadedImages) setUploadedImages(hashes)

  try {
    const tx = await airdropStartAirdrop(
      chainId,
      signer,
      signature,
      urlName,
      name,
      serverId,
      roles.map(([roleId, { traits, NFTName }]) => ({
        roleId,
        tokenImageHash: hashes[roleId],
        NFTName,
        traitTypes: traits.map(({ key }) => key),
        values: traits.map(({ value }) => value),
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
