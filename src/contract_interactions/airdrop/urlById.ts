import { Chains } from "connectors"
import airdropContracts from "contracts"

const urlById = (chainId: number, id: number): Promise<string> =>
  airdropContracts[Chains[chainId]].urlById(id)

export default urlById
