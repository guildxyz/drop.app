import { Provider } from "@ethersproject/providers"
import { getERC20AirdropContract } from "contracts"

const getDropBalance = (
  chainId: number,
  urlName: string,
  provider?: Provider
): Promise<number> =>
  getERC20AirdropContract(chainId, provider)
    .balanceOfDrops(urlName)
    .catch(() => {
      throw new Error("Failed to read drop balance")
    })

export default getDropBalance
