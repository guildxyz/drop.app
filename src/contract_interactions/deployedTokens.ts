import { contractsByDeployer, numOfDeployedContracts } from "./airdrop"

const deployedTokens = async (
  chainId: number,
  address: string
): Promise<string[]> => {
  const numberOfTokens = await numOfDeployedContracts(chainId, address)
  const tokenAddresses = await Promise.all(
    [...Array(+numberOfTokens)].map((_, index) =>
      contractsByDeployer(chainId, address, index)
    )
  )
  return tokenAddresses
}

export default deployedTokens
