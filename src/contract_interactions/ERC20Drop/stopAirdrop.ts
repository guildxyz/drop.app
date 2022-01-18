import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const stopAirdrop = (
  chainId: number,
  signer: JsonRpcSigner,
  urlName: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, "ERC20", provider).connect(signer).stopAirdrop(urlName)

export default stopAirdrop
