import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const getDropBalance = (
  chainId: number,
  urlName: string,
  provider?: Provider
): Promise<number> =>
  getAirdropContract(chainId, "ERC20", provider)
    .balanceOfDrops(urlName)
    .catch(() => {
      throw new Error("Failed to read drop balance")
    })

export default getDropBalance
