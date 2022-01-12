import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getERC20AirdropContract } from "contracts"

const claim = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  urlName: string,
  roleId: string,
  userIdHash: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getERC20AirdropContract(chainId, provider)
    .connect(signer)
    .claim(signature, urlName, userIdHash, roleId)

export default claim
