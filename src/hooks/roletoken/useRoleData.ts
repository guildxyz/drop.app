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
  roleId: string
) => getDataOfRole(chainId, tokenAddress, serverId, roleId)

const useRoleData = (
  tokenAddress: string,
  serverId: string,
  roleId: string
): RoleData => {
  const { chainId } = useWeb3React()

  const shouldFetch =
    serverId?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["roleData", chainId, tokenAddress, serverId, roleId] : null,
    getRoleData
  )

  return data
}

export default useRoleData
