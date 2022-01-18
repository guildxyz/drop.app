import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const isClaimed = (
  chainId: number,
  urlName: string,
  userId: string,
  roleId: string,
  provider?: Provider
): Promise<boolean> =>
  getAirdropContract(chainId, "ERC20", provider)
    .claimed(urlName, roleId, userId)
    .catch(() => {
      throw new Error("Failed to read claimed drops")
    })

export default isClaimed
