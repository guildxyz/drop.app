import { Provider } from "@ethersproject/providers"
import { getTokenContract } from "contracts"

const getSymbol = (
  chainId: number,
  tokenAddress: string,
  provider?: Provider
): Promise<string> => getTokenContract(chainId, tokenAddress, provider).symbol()

export default getSymbol
