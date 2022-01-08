import { Provider } from "@ethersproject/providers"
import { fetchGroupName } from "components/[drop]/hooks/useCommunityName/hooks/useGroupName"
import { getServerData } from "components/[drop]/hooks/useCommunityName/hooks/useServerData"
import { fetchGroupImage } from "components/[drop]/hooks/useDropIcon/hooks/useGroupImage"
import { fetchHasAccess } from "hooks/useHasAccess"
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
  const [dropData, tokenAddress] = await Promise.all([
    getDataOfDrop(chainId, urlName, provider),
    getTokenAddress(chainId, urlName, provider),
  ])

  const { platform, serverId } = dropData

  const hasAccess = await fetchHasAccess("", serverId, platform)

  const [communityImage, communityName] = await (platform === "DISCORD"
    ? getServerData("", serverId)
        .then(({ id, icon, name }) => [
          icon?.length > 0 ? `https://cdn.discordapp.com/icons/${id}/${icon}` : null,
          name,
        ])
        .catch(() => ["", ""])
    : Promise.all([
        fetchGroupImage("", serverId).catch(() => ""),
        fetchGroupName("", serverId).catch(() => ""),
      ]))

  /**
   * TODO:
   *
   * Here we should request all the roles, and filter for the ones that have
   * metadata, and maybe append the active boolean data to the role, this way we
   * could display all the ClaimCard-s, that are or were active in the drop and
   * disable the ones that aren't currently active
   */
  if (platform === "DISCORD") {
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
      communityImage,
      communityName,
      hasAccess,
      roles: Object.fromEntries(
        activeRoles.map((roleId, index) => [roleId, metadatas[index]])
      ),
    }
  }

  // Fetching for telegram

  const mataData = await metadata(
    chainId,
    platform,
    serverId,
    tokenAddress,
    provider
  )

  return {
    ...dropData,
    tokenAddress,
    communityImage,
    communityName,
    hasAccess,
    roles: { [serverId]: mataData },
  }
}

export default getDropRolesData
