import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const contractsByDeployer = (
  chainId: number,
  address: string,
  contractId: number,
  provider?: Provider
): Promise<string> =>
  getAirdropContract(chainId, "NFT", provider).contractsByDeployer(
    address,
    contractId
  )

export default contractsByDeployer
