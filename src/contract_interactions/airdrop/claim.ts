import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const claim = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  serverId: string,
  roleId: string,
  tokenAddress: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, provider)
    .connect(signer)
    .claim(signature, serverId, roleId, tokenAddress)

export default claim
