import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const startAirdrop = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  tokenName: string,
  tokenSymbol: string,
  urlName: string,
  platform: string,
  dropName: string,
  serverId: string,
  roleIds: string[],
  metaDataHashes: string[],
  channelId: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, "NFT", provider)
    .connect(signer)
    .startAirdrop(
      signature,
      tokenName,
      tokenSymbol,
      urlName,
      platform,
      dropName,
      serverId,
      roleIds,
      metaDataHashes,
      channelId
    )

export default startAirdrop
