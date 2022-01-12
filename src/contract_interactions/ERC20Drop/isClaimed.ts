import { Provider } from "@ethersproject/providers"
import { getERC20AirdropContract } from "contracts"

const isClaimed = (
  chainId: number,
  urlName: string,
  userId: string,
  roleId: string,
  provider?: Provider
): Promise<boolean> =>
  getERC20AirdropContract(chainId, provider)
    .claimed(urlName, roleId, userId)
    .catch(() => {
      throw new Error("Failed to read claimed drops")
    })

export default isClaimed
