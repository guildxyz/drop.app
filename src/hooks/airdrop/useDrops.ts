import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { DropWithRoles } from "contract_interactions/getDropRolesData"
import getDrops from "contract_interactions/getDrops"
import useSWR from "swr"

const fetchDrops = async (
  _: string,
  chainId: number,
  provider: Provider
): Promise<DropWithRoles[]> => getDrops(chainId, provider)

const useDrops = (fallbackData: DropWithRoles[]): DropWithRoles[] => {
  const { chainId, library } = useWeb3React<Web3Provider>()

  const { data } = useSWR(["drops", chainId, library], fetchDrops, { fallbackData })

  return data
}

export default useDrops
