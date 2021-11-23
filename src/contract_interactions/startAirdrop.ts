import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { StartAirdropData } from "components/start-airdrop/SubmitButton/hooks/useStartAirdrop"
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
): Promise<string> => {
  const { contractId, serverId, name, roles, channel, urlName, platform } = data
  console.log(data)

  const roleIds = roles.map(({ roleId }) => roleId)
  if (contractId === "DEPLOY") throw new Error("Invalid token contract")

  const [signature, tokenAddress] = await Promise.all([
    startAirdropSignature(
      serverId,
      account,
      chainId,
      urlName,
      platform,
      roleIds
    ).catch((error) => {
      console.log("Signature rejected")
      console.error(error)
      throw error
    }),
    contractsByDeployer(chainId, account, +contractId, provider).catch((error) => {
      console.log("contractsByDeployer call rejected")
      console.error(error)
      throw error
    }),
  ])

  const imagesToUpload = Object.fromEntries(
    roles
      .filter(({ image }) => image.length > 0)
      .map(({ roleId, image: [image] }) => [roleId, image])
  )

  const hashes = Object.keys(imagesToUpload).length
    ? await uploadImages(imagesToUpload, serverId, tokenAddress)
    : {}

  // Append the default hash for the roles withour uploaded image
  roles
    .filter(({ image }) => image.length <= 0)
    .forEach(
      ({ roleId }) => (hashes[roleId] = process.env.NEXT_PUBLIC_DEFAULT_IMAGE_HASH)
    )

  if (!!setUploadedImages) setUploadedImages(hashes)

  const contractRoles = roles.map(({ traits, NFTName, roleId }) => ({
    tokenImageHash: hashes[roleId],
    NFTName,
    ...traits
      .filter(({ key, value }) => key.length > 0 && value.length > 0)
      .reduce(
        (_acc, { key, value }) => {
          const acc = _acc
          acc.traitTypes.push(key)
          acc.values.push(value)
          return acc
        },
        { traitTypes: ["Server ID", "Role ID"], values: [serverId, roleId] }
      ),
  }))

  const tx = await airdropStartAirdrop(
    chainId,
    signer,
    signature,
    urlName,
    platform,
    name,
    serverId,
    roleIds,
    contractRoles,
    +contractId,
    channel,
    provider
  )

  await tx.wait()

  return urlName
}

export default startAirdrop
