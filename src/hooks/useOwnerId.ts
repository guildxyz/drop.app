import useSWRImmutable from "swr/immutable"

const fetchOwnerId = (_: string, serverId: string) =>
  fetch(`${process.env.NEXT_PUBLIC_DISCORD_API}/owner/${serverId}`).then(
    (response) =>
      response.ok
        ? response.json()
        : Promise.reject(Error("Failed to fetch server owner"))
  )

const useOwnerId = (serverId: string, fromServer: string = undefined) => {
  const shouldFetch = typeof serverId === "string" && serverId.length > 0
  const { data } = useSWRImmutable(
    shouldFetch ? ["server", serverId] : null,
    fetchOwnerId,
    { fallbackData: fromServer }
  )

  return fromServer ?? data
}

export default useOwnerId
export { fetchOwnerId }
