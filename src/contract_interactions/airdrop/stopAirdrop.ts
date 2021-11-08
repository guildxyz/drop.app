import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner } from "@ethersproject/providers"
import { Chains } from "connectors"
import airdropContracts from "contracts"

const stopAirdrop = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  serverId: string,
  roleId: string,
  contractId: number
): Promise<TransactionResponse> =>
  airdropContracts[Chains[chainId]]
    .connect(signer)
    .stopAirdrop(signature, serverId, roleId, contractId)

export default stopAirdrop
