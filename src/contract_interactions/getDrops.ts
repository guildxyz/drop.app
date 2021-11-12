import { numOfDrops, urlById } from "./airdrop"
import getDropRolesData, { DropWithRoles } from "./getDropRolesData"

const getDrops = async (chainId: number): Promise<DropWithRoles[]> => {
  const dropsCount = await numOfDrops(chainId).then((_) => +_)
  const dropUrls = await Promise.all(
    [...Array(dropsCount)].map((_, i) => urlById(chainId, i))
  )
  const drops = await Promise.all(
    dropUrls.map((url, id) =>
      getDropRolesData(chainId, url).then((drop) => ({
        ...drop,
        id,
      }))
    )
  )
  return drops
}

export default getDrops
