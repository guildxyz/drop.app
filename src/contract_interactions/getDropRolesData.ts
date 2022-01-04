import { Provider } from "@ethersproject/providers"
import { fetchGroupImage } from "hooks/useGroupImage"
import { getServerData } from "hooks/useServerData"
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

  const platformImage = await (platform === "DISCORD"
    ? getServerData("", serverId).then(
        ({ id, icon }) => `https://cdn.discordapp.com/icons/${id}/${icon}`
      )
    : fetchGroupImage("", serverId).then((path) =>
        fetch(
          `https://api.telegram.org/file/bot5099341542:AAFArM0ij5nsWAW1SQPbCGm_GyY1YMfloNE/${path}`
        )
          .then((response) =>
            response
              .arrayBuffer()
              .then(
                (arrayBuffer) =>
                  `data:image/${path.split(".").pop()};base64,${Buffer.from(
                    arrayBuffer
                  ).toString("base64")}`
              )
          )
          .catch((e) => {
            console.error(e)
            return ""
          })
      ))

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
      platformImage,
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
    platformImage,
    roles: { [serverId]: mataData },
  }
}

export default getDropRolesData
