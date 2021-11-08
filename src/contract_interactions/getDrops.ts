import { dropNamesById, getDataOfDrop, numOfDrops } from "./airdrop"
import { Drop } from "./types"

const getDrops = async (chainId: number): Promise<Drop[]> => {
  const dropsCount = await numOfDrops(chainId).then((_) => +_)
  const dropNames = await Promise.all(
    [...Array(dropsCount)].map((_, i) => dropNamesById(chainId, i))
  )
  const drops = await Promise.all(
    dropNames.map((name, id) =>
      getDataOfDrop(chainId, name).then((drop) => ({
        ...drop,
        id,
      }))
    )
  )
  return drops
}

export default getDrops
