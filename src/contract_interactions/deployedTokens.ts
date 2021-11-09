import { aggregate } from "@makerdao/multicall"
import { Chains } from "connectors"
import { AirdropAddresses, multicallConfigs } from "contracts"
import { numOfDeployedContracts } from "./airdrop"

const deployedTokens = async (
  chainId: number,
  address: string
): Promise<string[]> => {
  const numberOfTokens = await numOfDeployedContracts(chainId, address)

  const requests = [...Array(+numberOfTokens)].map((_, index) => ({
    target: AirdropAddresses[Chains[chainId]],
    call: ["contractsByDeployer(address,uint256)(address)", address, index],
    returns: [[index]],
  }))

  const {
    results: { original },
  } = await aggregate(requests, multicallConfigs[Chains[chainId]])

  return Object.values(original)
}

export default deployedTokens
