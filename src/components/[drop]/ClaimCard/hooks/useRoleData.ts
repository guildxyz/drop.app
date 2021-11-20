import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import getDataOfRole from "contract_interactions/roletoken/getDataOfRole"
import useSWR from "swr"

export type RoleData = {
  imageHash: string
  tokenName: string
  traits: Array<[string, string]>
}

const getRoleData = (
  _: "roleData",
  chainId: number,
  tokenAddress: string,
  serverId: string,
  roleId: string,
  provider: Provider
) => getDataOfRole(chainId, tokenAddress, serverId, roleId, provider)

const useRoleData = (
  tokenAddress: string,
  serverId: string,
  roleId: string,
  fallbackData?: RoleData
): RoleData => {
  const { chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch =
    serverId?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["roleData", chainId, tokenAddress, serverId, roleId, library]
      : null,
    getRoleData,
    { fallbackData }
  )

  return data
}

export default useRoleData
