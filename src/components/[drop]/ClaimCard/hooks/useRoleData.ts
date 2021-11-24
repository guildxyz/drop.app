import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import getDataOfRole from "contract_interactions/roletoken/getDataOfRole"
import { RoleData } from "contract_interactions/types"
import useSWR from "swr"

const getRoleData = (
  _: "roleData",
  chainId: number,
  tokenAddress: string,
  platform: string,
  roleId: string,
  provider: Provider
) => getDataOfRole(chainId, tokenAddress, platform, roleId, provider)

const useRoleData = (
  tokenAddress: string,
  platform: string,
  roleId: string,
  fallbackData?: RoleData
): RoleData => {
  const { chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch =
    platform?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["roleData", chainId, tokenAddress, platform, roleId, library]
      : null,
    getRoleData,
    { fallbackData }
  )

  return data
}

export default useRoleData
