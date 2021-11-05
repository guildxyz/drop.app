import { Chains } from "connectors"
import airdropContracts from "contracts"

const numOfDrops = (chainId: number): Promise<number> =>
  airdropContracts[Chains[chainId]].numOfDrops()

export default numOfDrops
