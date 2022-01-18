import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const addBalanceToDrop = (
  chainId: number,
  signer: JsonRpcSigner,
  urlName: string,
  amount: number,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, "ERC20", provider)
    .connect(signer)
    .addBalanceToDrop(urlName, amount)

export default addBalanceToDrop
