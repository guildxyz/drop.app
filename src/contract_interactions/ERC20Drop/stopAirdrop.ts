import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getERC20AirdropContract } from "contracts"

const stopAirdrop = (
  chainId: number,
  signer: JsonRpcSigner,
  urlName: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getERC20AirdropContract(chainId, provider).connect(signer).stopAirdrop(urlName)

export default stopAirdrop
