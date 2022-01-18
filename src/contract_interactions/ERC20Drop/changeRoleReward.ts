import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const changeRoleReward = (
  chainId: number,
  signer: JsonRpcSigner,
  urlName: string,
  roleId: string,
  newReward: number,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, "ERC20", provider)
    .connect(signer)
    .changeRoleReward(urlName, roleId, newReward)

export default changeRoleReward
