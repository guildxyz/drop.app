import { BigNumber } from "@ethersproject/bignumber"
import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const numOfDeployedContracts = (
  chainId: number,
  address: string,
  provider?: Provider
): Promise<number> =>
  getAirdropContract(chainId, provider)
    .numOfDeployedContracts(address)
    .then((_: BigNumber) => +_)

export default numOfDeployedContracts
