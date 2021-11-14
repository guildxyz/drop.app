import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import getDropRolesData, {
  DropWithRoles,
} from "contract_interactions/getDropRolesData"
import useSWR from "swr"

const getDropWithRoles = async (
  _: string,
  chainId: number,
  urlName: string,
  provider: Provider
): Promise<DropWithRoles> => getDropRolesData(chainId, urlName, provider)

const useDropWithRoles = (
  urlName: string,
  fallbackData?: DropWithRoles
): DropWithRoles => {
  const { chainId, library } = useWeb3React<Web3Provider>()

  const { data } = useSWR(
    ["dropsWithRoles", chainId, urlName, library],
    getDropWithRoles,
    {
      fallbackData,
      revalidateOnMount: true,
    }
  )

  return data
}

export default useDropWithRoles
