import { numOfDrops, urlById } from "./airdrop"

const getDropUrlNames = (chainId: number): Promise<string[]> =>
  numOfDrops(chainId).then((dropsCount) =>
    Promise.all([...Array(dropsCount)].map((_, i) => urlById(chainId, i)))
  )

export default getDropUrlNames
