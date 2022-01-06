import { Platform } from "contract_interactions/types"
import useSWR from "swr"
import { getServerData } from "../../useCommunityName/hooks/useServerData"

const getServerImage = async (_: string, serverId: string) =>
  getServerData(_, serverId).then(
    ({ id, icon }) => `https://cdn.discordapp.com/icons/${id}/${icon}`
  )

const useServerImage = (
  serverId: string,
  fallbackData: string,
  platform: Platform
): string => {
  const shouldFetch = serverId?.length > 0 && platform === "DISCORD"
  const { data } = useSWR(
    shouldFetch ? ["serverImage", serverId] : null,
    getServerImage,
    {
      fallbackData,
      revalidateOnMount: true,
    }
  )
  return data
}

export { getServerData }
export default useServerImage
