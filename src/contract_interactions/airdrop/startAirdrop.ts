import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner } from "@ethersproject/providers"
import { Chains } from "connectors"
import airdropContracts from "contracts"
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
  channelId: string
): Promise<TransactionResponse> =>
  airdropContracts[Chains[chainId]]
    .connect(signer)
    .newAirdrop(signature, urlName, dropName, serverId, roles, contractId, channelId)

export default startAirdrop
