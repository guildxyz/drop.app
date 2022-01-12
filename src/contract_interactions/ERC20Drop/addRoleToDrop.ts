import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getERC20AirdropContract } from "contracts"

const addRoleToDrop = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  urlName: string,
  roleId: string,
  reward: number,
  channelId: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getERC20AirdropContract(chainId, provider)
    .connect(signer)
    .addRoleToDrop(signature, urlName, roleId, reward, channelId)

export default addRoleToDrop
