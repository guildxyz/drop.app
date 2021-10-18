import useSWR from "swr"
import useAirdrop, { Role } from "./useAirdrop"

const getDrops = async (
  _: string,
  numOfDrops: () => Promise<number>,
  dropNamesById: (id: number) => Promise<string>,
  getDataOfDrop: (name: string) => Promise<Role>
): Promise<Role[]> => {
  const dropsCount = await numOfDrops().then((_) => +_)
  const dropNames = await Promise.all(
    [...Array(dropsCount)].map((_, i) => dropNamesById(i))
  )
  const drops = await Promise.all(
    dropNames.map((name, id) =>
      getDataOfDrop(name).then((drop) => ({
        serverId: drop[0],
        roleIds: drop[1],
        tokenAddress: drop[2],
        name,
        id,
      }))
    )
  )
  return drops
}

const useDrops = (): Role[] => {
  const { numOfDrops, dropNamesById, getDataOfDrop } = useAirdrop()

  const { data } = useSWR(
    ["drops", numOfDrops, dropNamesById, getDataOfDrop],
    getDrops
  )

  return data
}

export default useDrops
