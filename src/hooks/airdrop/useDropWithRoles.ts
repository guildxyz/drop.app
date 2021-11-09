import { useWeb3React } from "@web3-react/core"
import getDropRolesData, {
  DropWithRoles,
} from "contract_interactions/getDropRolesData"
import useSWR from "swr"

const getDropWithRoles = async (
  _: string,
  chainId: number,
  urlName: string
): Promise<DropWithRoles> => getDropRolesData(chainId, urlName)

const useDropWithRoles = (
  urlName: string,
  fallbackData?: DropWithRoles
): DropWithRoles => {
  const { chainId } = useWeb3React()

  const { data } = useSWR(["dropsWithRoles", chainId, urlName], getDropWithRoles, {
    fallbackData,
    revalidateOnMount: true,
  })

  return data
}

export default useDropWithRoles
