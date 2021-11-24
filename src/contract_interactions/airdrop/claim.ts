import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const claim = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  platform: string,
  roleId: string,
  userIdHash: string,
  tokenAddress: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, provider)
    .connect(signer)
    .claim(signature, platform, roleId, userIdHash, tokenAddress)

export default claim
