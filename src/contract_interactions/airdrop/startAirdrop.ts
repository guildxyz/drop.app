import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"
import { Data } from "contract_interactions/types"

const startAirdrop = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  urlName: string,
  platform: string,
  dropName: string,
  serverId: string,
  roleIds: string[],
  roles: Data[],
  contractId: number,
  channelId: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, provider)
    .connect(signer)
    .airdropOnServer(
      signature,
      urlName,
      platform,
      dropName,
      serverId,
      roleIds,
      roles,
      contractId,
      channelId
    )

export default startAirdrop
