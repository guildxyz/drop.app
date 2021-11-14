import { Provider } from "@ethersproject/providers"
import { getTokenContract } from "contracts"

const getName = (
  chainId: number,
  tokenAddress: string,
  provider?: Provider
): Promise<string> => getTokenContract(chainId, tokenAddress, provider).name()

export default getName
