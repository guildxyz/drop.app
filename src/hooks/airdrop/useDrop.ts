import { useWeb3React } from "@web3-react/core"
import { getDataOfDrop } from "contract_interactions/airdrop"
import { Drop } from "contract_interactions/types"
import useSWR from "swr"

const getDrop = async (_: string, chainId: number, urlName: string): Promise<Drop> =>
  getDataOfDrop(chainId, urlName)

const useDrop = (urlName: string, fallbackData?: Drop): Drop => {
  const { chainId } = useWeb3React()

  const { data } = useSWR(["drops", chainId, urlName], getDrop, {
    fallbackData,
    revalidateOnMount: true,
  })

  return data
}

export default useDrop
