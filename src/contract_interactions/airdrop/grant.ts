import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const grant = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  serverId: string,
  roleId: string,
  recieverAddress: string,
  contractId: number,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, provider)
    .connect(signer)
    .grant(signature, serverId, roleId, recieverAddress, contractId)

export default grant
