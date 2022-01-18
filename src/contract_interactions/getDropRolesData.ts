import { Provider } from "@ethersproject/providers"
import {
  fetchGroupName,
  getServerData,
} from "components/[drop]/hooks/useCommunityName"
import { fetchGroupImage } from "components/[drop]/hooks/useDropIcon"
import { getContractType } from "contracts"
import { fetchHasAccess } from "hooks/useHasAccess"
import { getDataOfDrop as getNFTDropData } from "./airdrop"
import { contractOfDrop } from "./dropCenter"
import getERC20DropData from "./ERC20Drop/getDataOfDrop"
import getRewardOfRole from "./ERC20Drop/getRewardOfRole"
import metadata from "./metadata"
import { Drop, RoleData } from "./types"
import getActiveRoles from "./utils/getActiveRoles"
import getTokenAddress from "./utils/getTokenAddress"

export type DropWithRoles = Drop & {
  roles: Record<string, RoleData> | Record<string, string>
}

const getDropRolesData = async (
  chainId: number,
  urlName: string,
  provider?: Provider
): Promise<DropWithRoles> => {
  const dropContractAddress = await contractOfDrop(chainId, urlName, provider)
  const dropContractType = getContractType(dropContractAddress)

  const [dropData, tokenAddress] = await Promise.all([
    dropContractType === "NFT"
      ? getNFTDropData(chainId, urlName, provider)
      : getERC20DropData(chainId, urlName, provider),
    getTokenAddress(chainId, urlName, dropContractType, provider),
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
        fetchGroupImage(serverId).catch(() => ""),
        fetchGroupName(serverId).catch(() => ""),
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
      dropContractType,
      provider
    )

    const roles = await (dropContractType === "NFT"
      ? Promise.all(
          activeRoles.map((roleId) =>
            metadata(chainId, platform, roleId, tokenAddress, provider)
          )
        ).then((metadatas) =>
          Object.fromEntries(
            activeRoles.map((roleId, index) => [roleId, metadatas[index]])
          )
        )
      : Promise.all(
          activeRoles.map((roleId) =>
            getRewardOfRole(chainId, urlName, roleId, provider).then((_) =>
              _.toString()
            )
          )
        ).then((rewards) =>
          Object.fromEntries(
            activeRoles.map((roleId, index) => [roleId, rewards[index]])
          )
        ))

    return {
      ...dropData,
      tokenAddress,
      communityImage,
      communityName,
      hasAccess,
      dropContractAddress,
      dropContractType,
      roles,
    }
  }

  // Fetching for telegram

  const roles = await (dropContractType === "NFT"
    ? metadata(chainId, platform, serverId, tokenAddress, provider).then((data) => ({
        [serverId]: data,
      }))
    : getRewardOfRole(chainId, urlName, serverId, provider).then((reward) => ({
        [serverId]: reward.toString(),
      })))

  return {
    ...dropData,
    tokenAddress,
    communityImage,
    communityName,
    hasAccess,
    dropContractAddress,
    dropContractType,
    roles,
  }
}

export default getDropRolesData
