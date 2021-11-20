import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const deployTokenContract = async (
  chainId: number,
  signer: JsonRpcSigner,
  tokenName: string,
  tokenSymbol: string,
  description: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, provider)
    .connect(signer)
    .deployTokenContract(tokenName, tokenSymbol, description)

export default deployTokenContract
