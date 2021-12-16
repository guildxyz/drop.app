import { Provider } from "@ethersproject/providers"
import { getDataOfDrop } from "./airdrop"
import metadata from "./metadata"
import { Drop, RoleData } from "./types"
import getActiveRoles from "./utils/getActiveRoles"
import getTokenAddress from "./utils/getTokenAddress"

export type DropWithRoles = Drop & { roles: Record<string, RoleData> }

const getDropRolesData = async (
  chainId: number,
  urlName: string,
  provider?: Provider
): Promise<DropWithRoles> => {
  const dropData = await getDataOfDrop(chainId, urlName, provider)
  const { platform, serverId } = dropData
  const tokenAddress = await getTokenAddress(chainId, urlName, provider)
  /**
   * TODO:
   *
   * Here we should request all the roles, and filter for the ones that have
   * metadata, and maybe append the active boolean data to the role, this way we
   * could display all the ClaimCard-s, that are or were active in the drop and
   * disable the ones that aren't currently active
   */
  const activeRoles = await getActiveRoles(
    chainId,
    urlName,
    serverId,
    tokenAddress,
    provider
  )
  const metadatas = await Promise.all(
    activeRoles.map((roleId) =>
      metadata(chainId, platform, roleId, tokenAddress, provider)
    )
  )

  return {
    ...dropData,
    tokenAddress,
    roles: Object.fromEntries(
      activeRoles.map((roleId, index) => [roleId, metadatas[index]])
    ),
  }
}

export default getDropRolesData
