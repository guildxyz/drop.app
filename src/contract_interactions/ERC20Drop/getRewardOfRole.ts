import { BigNumber } from "@ethersproject/bignumber"
import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const getRewardOfRole = (
  chainId: number,
  urlName: string,
  roleId: string,
  provider?: Provider
): Promise<BigNumber> =>
  getAirdropContract(chainId, "ERC20", provider)
    .rewardOfRole(urlName, roleId)
    .catch(() => {
      throw new Error("Failed to read reward of role")
    })

export default getRewardOfRole
