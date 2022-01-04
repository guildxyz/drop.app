import useSWR from "swr"
import { getServerData } from "./useServerData"

const getServerImage = async (_: string, serverId: string) =>
  getServerData(_, serverId).then(
    ({ id, icon }) => `https://cdn.discordapp.com/icons/${id}/${icon}`
  )

const useServerImage = (
  serverId: string,
  fallbackData: string,
  platform: "TELEGRAM" | "DISCORD" = "DISCORD"
): string => {
  const shouldFetch = serverId?.length > 0 && platform === "DISCORD"
  const { data } = useSWR(
    shouldFetch ? ["serverData", serverId] : null,
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
