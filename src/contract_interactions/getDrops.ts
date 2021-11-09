import { getDataOfDrop, numOfDrops, urlById } from "./airdrop"
import { Drop } from "./types"

const getDrops = async (chainId: number): Promise<Drop[]> => {
  const dropsCount = await numOfDrops(chainId).then((_) => +_)
  const dropUrls = await Promise.all(
    [...Array(dropsCount)].map((_, i) => urlById(chainId, i))
  )
  const drops = await Promise.all(
    dropUrls.map((url, id) =>
      getDataOfDrop(chainId, url).then((drop) => ({
        ...drop,
        id,
      }))
    )
  )
  return drops
}

export default getDrops
