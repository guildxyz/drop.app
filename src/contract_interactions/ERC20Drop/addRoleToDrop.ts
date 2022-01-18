import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

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
  getAirdropContract(chainId, "ERC20", provider)
    .connect(signer)
    .addRoleToDrop(signature, urlName, roleId, reward, channelId)

export default addRoleToDrop
