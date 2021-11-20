import useSWRImmutable from "swr/immutable"

const fetchOwnerId = (_: string, serverId: string): Promise<string> =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/owner/${serverId}`).then(
    (response) =>
      response.ok
        ? response.json()
        : Promise.reject(Error("Failed to fetch server owner"))
  )

const useOwnerId = (serverId: string): string => {
  const shouldFetch = typeof serverId === "string" && serverId.length > 0
  const { data } = useSWRImmutable(
    shouldFetch ? ["server", serverId] : null,
    fetchOwnerId
  )

  return data
}

export default useOwnerId
export { fetchOwnerId }
