import { BigNumber } from "@ethersproject/bignumber"
import { Provider } from "@ethersproject/providers"
import { getDropCenterContract } from "contracts"

const numOfDrops = (chainId: number, provider?: Provider): Promise<number> =>
  getDropCenterContract(chainId, provider)
    .numOfDrops()
    .then((_: BigNumber) => +_)

export default numOfDrops
