import { Platform } from "contract_interactions/types"
import useSWR from "swr"
import { getServerData } from "./useCommunityName/hooks/useServerData"

const fetchGroupImage = (chatId: string) =>
  fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/chat-avatar/${chatId}`
  ).then((response) => response.json().then((body) => (response.ok ? body : "")))

const fetchServerImage = async (serverId: string) =>
  getServerData("", serverId).then((data) =>
    data?.icon?.length > 0
      ? `https://cdn.discordapp.com/icons/${data.id}/${data.icon}`
      : null
  )

const fetchDropIcon = (_: string, serverId: string, platform: Platform) =>
  platform === "DISCORD" ? fetchServerImage(serverId) : fetchGroupImage(serverId)

const useDropIcon = (
  serverId: string,
  fallbackData: string,
  platform: Platform,
  hasAccess: boolean
) => {
  const shouldFetch = hasAccess && serverId?.length > 0 && platform?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["dropIcon", serverId, platform] : null,
    fetchDropIcon,
    { fallbackData, revalidateOnMount: true }
  )
  return data || "/svg/discord-logo.svg"
}

export { fetchGroupImage }
export default useDropIcon
