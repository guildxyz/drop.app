import { BigNumber } from "@ethersproject/bignumber"
import { Chains } from "connectors"
import airdropContracts from "contracts"

const numOfDeployedContracts = (chainId: number, address: string): Promise<number> =>
  airdropContracts[Chains[chainId]]
    .numOfDeployedContracts(address)
    .then((_: BigNumber) => +_)

export default numOfDeployedContracts
