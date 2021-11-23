import { Provider } from "@ethersproject/providers"
import { numOfDrops, urlById } from "./dropCenter"
import getDropRolesData, { DropWithRoles } from "./getDropRolesData"

const getDrops = async (
  chainId: number,
  provider?: Provider
): Promise<DropWithRoles[]> => {
  const dropsCount = await numOfDrops(chainId, provider).then((_) => +_)
  const dropUrls = await Promise.all(
    [...Array(dropsCount)].map((_, i) => urlById(chainId, i, provider))
  )
  const drops = await Promise.all(
    dropUrls.map((url, id) =>
      getDropRolesData(chainId, url, provider).then((drop) => ({
        ...drop,
        id,
      }))
    )
  )
  return drops
}

export default getDrops
