import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { parseEther } from "@ethersproject/units"
import { StartAirdropData } from "components/start-airdrop/SubmitButton/hooks/useStartAirdrop"
import startAirdropWithNewToken from "./ERC20Drop/startAirdropWithNewToken"
import startTokenAirdropSignature from "./utils/signatures/startTokenAirdrop"

const startTokenAirdrop = async (
  chainId: number,
  account: string,
  signer: JsonRpcSigner,
  data: StartAirdropData,
  provider?: Provider
): Promise<string> => {
  const {
    serverId: formServerId,
    channel,
    urlName,
    platform,
    assetData,
    tokenRewards,
  } = data

  const serverId = platform === "TELEGRAM" ? `-${formServerId}` : formServerId

  const roleIds =
    platform === "DISCORD"
      ? Object.entries(tokenRewards.DISCORD)
          .filter(([, reward]) => !Number.isNaN(reward))
          .map(([roleId]) => roleId)
      : [serverId]

  const rewards =
    platform === "DISCORD"
      ? Object.values(tokenRewards.DISCORD)
          .filter((reward) => !Number.isNaN(reward))
          .map((reward) => parseEther(reward.toString()))
      : [parseEther(tokenRewards.TELEGRAM.toString())]

  const signature = await startTokenAirdropSignature(
    chainId,
    serverId,
    account,
    urlName,
    platform,
    roleIds
  ).catch((error) => {
    console.error(error)
    throw error
  })

  const tx = await startAirdropWithNewToken(
    chainId,
    signer,
    signature,
    urlName,
    platform,
    assetData.TOKEN.name,
    serverId,
    roleIds,
    platform === "TELEGRAM" ? serverId : channel,
    assetData.TOKEN.name,
    assetData.TOKEN.symbol,
    parseEther(assetData.TOKEN.initialBalance.toString()),
    rewards,
    provider
  )

  await tx.wait()

  return urlName
}

export default startTokenAirdrop
