import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { StartAirdropData } from "components/start-airdrop/SubmitButton/hooks/useStartAirdrop"
import { startAirdrop as airdropStartAirdrop } from "./airdrop"
import deployTokenContract from "./deployTokenContract"
import startAirdropSignature from "./utils/signatures/startAirdrop"

const startAirdrop = async (
  chainId: number,
  account: string,
  signer: JsonRpcSigner,
  data: StartAirdropData,
  provider?: Provider
): Promise<string> => {
  const { serverId, channel, urlName, platform, nfts, assetData } = data

  const roleIds = Object.values(nfts).reduce(
    (acc, curr) => [...acc, ...curr.roles],
    []
  )

  const [signature, contractId] = await Promise.all([
    startAirdropSignature(
      serverId,
      account,
      chainId,
      urlName,
      platform,
      roleIds
    ).catch((error) => {
      console.error(error)
      throw error
    }),
    deployTokenContract(
      chainId,
      account,
      signer,
      assetData.NFT.name,
      assetData.NFT.symbol,
      // TODO: description?
      "",
      provider
    ),
  ])

  const contractRoles = roleIds.map((roleId) => {
    const nft = Object.values(nfts).find((_) => _.roles.includes(roleId))

    return {
      tokenImageHash: nft.hash,
      NFTName: nft.name,
      ...nft.traits
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
    }
  })

  const tx = await airdropStartAirdrop(
    chainId,
    signer,
    signature,
    urlName,
    platform,
    assetData.NFT.name,
    serverId,
    roleIds,
    contractRoles,
    contractId,
    channel,
    provider
  )

  await tx.wait()

  return urlName
}

export default startAirdrop
