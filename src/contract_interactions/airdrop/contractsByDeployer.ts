import { Chains } from "connectors"
import airdropContracts from "contracts"

const contractsByDeployer = (
  chainId: number,
  address: string,
  index: number
): Promise<string> =>
  airdropContracts[Chains[chainId]].contractsByDeployer(address, index)

export default contractsByDeployer
