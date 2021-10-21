import useSWR from "swr"
import useAirdrop, { Drop } from "./useAirdrop"

const getDrop = async (
  _: string,
  name: string,
  getDataOfDrop: (name: string) => Promise<Drop & { name: string }>
): Promise<Drop> =>
  getDataOfDrop(name).then((drop) => ({
    ...drop,
    name,
  }))

const useDrop = (name: string, fallbackData?: Drop): Drop => {
  const { getDataOfDrop } = useAirdrop()

  const { data } = useSWR(["drops", name, getDataOfDrop], getDrop, {
    fallbackData,
    revalidateOnMount: true,
  })

  return data
}

export default useDrop
