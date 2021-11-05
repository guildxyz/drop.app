import { useWeb3React } from "@web3-react/core"
import getDrops from "contract_interactions/getDrops"
import { Drop } from "contract_interactions/types"
import useSWR from "swr"

const fetchDrops = async (_: string, chainId: number): Promise<Drop[]> =>
  getDrops(chainId)

const useDrops = (): Drop[] => {
  const { chainId } = useWeb3React()

  const { data } = useSWR(["drops", chainId], fetchDrops)

  return data
}

export default useDrops
