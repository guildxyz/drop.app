import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner } from "@ethersproject/providers"
import { Chains } from "connectors"
import airdropContracts from "contracts"

const claim = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  serverId: string,
  roleId: string,
  tokenAddress: string,
  userIdHash: string
): Promise<TransactionResponse> =>
  airdropContracts[Chains[chainId]]
    .connect(signer)
    .claim(signature, serverId, roleId, userIdHash, tokenAddress)

export default claim
