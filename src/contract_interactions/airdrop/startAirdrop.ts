import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"
import { Role } from "contract_interactions/types"

const startAirdrop = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  urlName: string,
  dropName: string,
  serverId: string,
  roles: Role[],
  contractId: number,
  channelId: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, provider)
    .connect(signer)
    .newAirdrop(signature, urlName, dropName, serverId, roles, contractId, channelId)

export default startAirdrop
