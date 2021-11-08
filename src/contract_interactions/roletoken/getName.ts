import { Chains } from "connectors"
import { tokenContractGetters } from "contracts"

const getName = (chainId: number, tokenAddress: string): Promise<string> =>
  tokenContractGetters[Chains[chainId]](tokenAddress).name()

export default getName
