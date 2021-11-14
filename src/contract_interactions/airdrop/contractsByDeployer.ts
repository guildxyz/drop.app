import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const contractsByDeployer = (
  chainId: number,
  address: string,
  index: number,
  provider?: Provider
): Promise<string> =>
  getAirdropContract(chainId, provider).contractsByDeployer(address, index)

export default contractsByDeployer
