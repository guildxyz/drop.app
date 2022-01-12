import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getERC20AirdropContract } from "contracts"

const changeRoleReward = (
  chainId: number,
  signer: JsonRpcSigner,
  urlName: string,
  roleId: string,
  newReward: number,
  provider?: Provider
): Promise<TransactionResponse> =>
  getERC20AirdropContract(chainId, provider)
    .connect(signer)
    .changeRoleReward(urlName, roleId, newReward)

export default changeRoleReward
