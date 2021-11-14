import { Provider } from "@ethersproject/providers"
import { getDataOfDrop } from "./airdrop"
import getDataOfRole from "./roletoken/getDataOfRole"
import { Drop, RoleData } from "./types"

export type DropWithRoles = Drop & { roles: Record<string, RoleData> }

const getDropRolesData = async (
  chainId: number,
  urlName: string,
  provider?: Provider
): Promise<DropWithRoles> => {
  const dropData = await getDataOfDrop(chainId, urlName, provider)
  const { roleIds, tokenAddress, serverId } = dropData
  const roles = await Promise.all(
    roleIds.map((roleId) =>
      getDataOfRole(chainId, tokenAddress, serverId, roleId, provider)
    )
  )

  return {
    ...dropData,
    roles: Object.fromEntries(
      roleIds.map((roleId, index) => [roleId, roles[index]])
    ),
  }
}

export default getDropRolesData
