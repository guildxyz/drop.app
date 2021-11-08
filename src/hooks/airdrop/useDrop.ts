import { useWeb3React } from "@web3-react/core"
import { getDataOfDrop } from "contract_interactions/airdrop"
import { Drop } from "contract_interactions/types"
import useSWR from "swr"

const getDrop = async (_: string, chainId: number, name: string): Promise<Drop> =>
  getDataOfDrop(chainId, name)

const useDrop = (name: string, fallbackData?: Drop): Drop => {
  const { chainId } = useWeb3React()

  const { data } = useSWR(["drops", chainId, name], getDrop, {
    fallbackData,
    revalidateOnMount: true,
  })

  return data
}

export default useDrop
