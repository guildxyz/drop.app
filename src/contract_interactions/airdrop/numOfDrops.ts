import { BigNumber } from "@ethersproject/bignumber"
import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const numOfDrops = (chainId: number, provider?: Provider): Promise<number> =>
  getAirdropContract(chainId, provider)
    .numOfDrops()
    .then((_: BigNumber) => +_)

export default numOfDrops
