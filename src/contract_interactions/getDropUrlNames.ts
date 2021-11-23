import { Provider } from "@ethersproject/providers"
import { numOfDrops, urlById } from "./dropCenter"

const getDropUrlNames = (chainId: number, provider?: Provider): Promise<string[]> =>
  numOfDrops(chainId, provider).then((dropsCount) =>
    Promise.all([...Array(dropsCount)].map((_, i) => urlById(chainId, i, provider)))
  )

export default getDropUrlNames
