import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getERC20AirdropContract } from "contracts"

const addBalanceToDrop = (
  chainId: number,
  signer: JsonRpcSigner,
  urlName: string,
  amount: number,
  provider?: Provider
): Promise<TransactionResponse> =>
  getERC20AirdropContract(chainId, provider)
    .connect(signer)
    .addBalanceToDrop(urlName, amount)

export default addBalanceToDrop
