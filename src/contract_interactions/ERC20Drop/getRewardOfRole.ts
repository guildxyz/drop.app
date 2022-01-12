import { Provider } from "@ethersproject/providers"
import { getERC20AirdropContract } from "contracts"

const getDropBalance = (
  chainId: number,
  urlName: string,
  roleId: string,
  provider?: Provider
): Promise<number> =>
  getERC20AirdropContract(chainId, provider)
    .rewardOfRole(urlName, roleId)
    .catch(() => {
      throw new Error("Failed to read reward of role")
    })

export default getDropBalance
