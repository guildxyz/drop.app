import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const deployTokenContract = async (
  chainId: number,
  signer: JsonRpcSigner,
  tokenName: string,
  tokenSymbol: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, "NFT", provider)
    .connect(signer)
    .deployTokenContract(tokenName, tokenSymbol)

export default deployTokenContract
