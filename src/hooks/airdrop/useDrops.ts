import { useWeb3React } from "@web3-react/core"
import { DropWithRoles } from "contract_interactions/getDropRolesData"
import getDrops from "contract_interactions/getDrops"
import useSWR from "swr"

const fetchDrops = async (_: string, chainId: number): Promise<DropWithRoles[]> =>
  getDrops(chainId)

const useDrops = (fallbackData: DropWithRoles[]): DropWithRoles[] => {
  const { chainId } = useWeb3React()

  const { data } = useSWR(["drops", chainId], fetchDrops, { fallbackData })

  return data
}

export default useDrops
