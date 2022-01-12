import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getERC20AirdropContract } from "contracts"

const startAirdropWithNewToken = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  urlName: string,
  platform: string,
  dropName: string,
  serverId: string,
  roleIds: string[],
  channelId: string,
  tokenName: string,
  tokenSymbol: string,
  startingBalance: number,
  rewards: number[],
  provider?: Provider
): Promise<TransactionResponse> =>
  getERC20AirdropContract(chainId, provider)
    .connect(signer)
    .newAirdropFromNewToken(
      signature,
      urlName,
      dropName,
      platform,
      serverId,
      roleIds,
      channelId,
      tokenName,
      tokenSymbol,
      startingBalance,
      rewards
    )

export default startAirdropWithNewToken
