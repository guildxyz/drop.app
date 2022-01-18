import { BigNumber } from "@ethersproject/bignumber"
import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const getDropBalance = (
  chainId: number,
  urlName: string,
  roleId: string,
  provider?: Provider
): Promise<number> =>
  getAirdropContract(chainId, "ERC20", provider)
    .rewardOfRole(urlName, roleId)
    .then((_: BigNumber) => +_)
    .catch(() => {
      throw new Error("Failed to read reward of role")
    })

export default getDropBalance
