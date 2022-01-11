import { Platform } from "contract_interactions/types"
import useSWR from "swr"

export type ServerData = {
  id: string
  name: string
  icon: string
}

const getServerData = (_: string, serverId: string): Promise<ServerData> =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/discord/server/${serverId}`).then(
    (response) =>
      response
        .json()
        .then((body) =>
          response.ok
            ? body
            : body.code === "BOT_IS_NOT_MEMBER"
            ? null
            : Promise.reject(body)
        )
  )

const fetchGroupName = (chatId: string): Promise<string> =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/chat-name/${chatId}`).then(
    (res) => res.json().then((body) => (res.ok ? body : Promise.reject(body)))
  )

const fetchCommunityName = (_: string, serverId: string, platform: Platform) =>
  platform === "DISCORD"
    ? getServerData(_, serverId).then((serverData) => serverData.name)
    : fetchGroupName(serverId)

const useCommunityName = (
  serverId: string,
  platform: Platform,
  hasAccess: boolean,
  fallbackData: string
) => {
  const shouldFetch = hasAccess && serverId?.length >= 0 && platform?.length >= 0

  const { data } = useSWR(
    shouldFetch ? ["communityName", serverId, platform] : null,
    fetchCommunityName,
    { fallbackData, revalidateOnMount: true }
  )

  return data
}

export { fetchGroupName, getServerData }
export default useCommunityName
