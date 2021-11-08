import { Chains } from "connectors"
import airdropContracts from "contracts"

const dropNamesById = (chainId: number, id: number): Promise<string> =>
  airdropContracts[Chains[chainId]].dropnamesById(id)

export default dropNamesById
