import useSWR from "swr"

export type ServerData = {
  id: string
  name: string
  icon: string
}

const getServerData = (_: string, serverId: string): Promise<ServerData> =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/server/${serverId}`).then(
    (response) => (response.ok ? response.json() : Promise.reject(Error()))
  )

const useServerData = (
  serverId: string,
  platform: "TELEGRAM" | "DISCORD" = "DISCORD"
): ServerData => {
  const shouldFetch = serverId?.length > 0 && platform === "DISCORD"
  const { data } = useSWR(
    shouldFetch ? ["serverData", serverId] : null,
    getServerData,
    {
      fallbackData: {
        name: "",
        id: serverId,
        icon: "",
      },
      revalidateOnMount: true,
    }
  )
  return data
}

export default useServerData
