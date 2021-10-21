import useSWR from "swr"
import useAirdrop, { Drop } from "./useAirdrop"

const getDrops = async (
  _: string,
  numOfDrops: () => Promise<number>,
  dropNamesById: (id: number) => Promise<string>,
  getDataOfDrop: (name: string) => Promise<Drop>
): Promise<Drop[]> => {
  const dropsCount = await numOfDrops().then((_) => +_)
  const dropNames = await Promise.all(
    [...Array(dropsCount)].map((_, i) => dropNamesById(i))
  )
  const drops = await Promise.all(
    dropNames.map((name, id) =>
      getDataOfDrop(name).then((drop) => ({
        ...drop,
        name,
        id,
      }))
    )
  )
  return drops
}

const useDrops = (): Drop[] => {
  const { numOfDrops, dropNamesById, getDataOfDrop } = useAirdrop()

  const { data } = useSWR(
    ["drops", numOfDrops, dropNamesById, getDataOfDrop],
    getDrops
  )

  return data
}

export default useDrops
