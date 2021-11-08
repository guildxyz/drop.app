import { Chains } from "connectors"
import { tokenContractGetters } from "contracts"

const getSymbol = (chainId: number, tokenAddress: string): Promise<string> =>
  tokenContractGetters[Chains[chainId]](tokenAddress).symbol()

export default getSymbol
