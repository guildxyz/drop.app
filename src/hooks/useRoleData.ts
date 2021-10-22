import useSWR from "swr"
import useRoleToken from "./useRoleToken"

export type RoleData = {
  imageHash: string
  tokenName: string
  traits: Array<[string, string]>
}

const getRoleData = (
  _: string,
  serverId: string,
  roleId: string,
  getDataOfRole: (serverId: string, roleId: string) => Promise<RoleData>
) => getDataOfRole(serverId, roleId)

const useRoleData = (
  tokenAddress: string,
  serverId: string,
  roleId: string
): RoleData => {
  const { getDataOfRole } = useRoleToken(tokenAddress)

  const shouldFetch = !!getDataOfRole && serverId?.length > 0 && roleId?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["roleData", serverId, roleId, getDataOfRole] : null,
    getRoleData
  )

  return data
}

export default useRoleData
