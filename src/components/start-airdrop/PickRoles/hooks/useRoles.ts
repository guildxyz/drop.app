import useSWRImmutable from "swr/immutable"

const fetchRoles = (_: string, serverId: string) =>
  fetch(`${process.env.NEXT_PUBLIC_DISCORD_API}/ranks/${serverId}`).then(
    (response) =>
      response.ok ? response.json() : Promise.reject(Error("Failed to fetch roles"))
  )

const useRoles = (serverId: string, _shouldFetch = true) => {
  const shouldFetch =
    typeof serverId === "string" && serverId.length > 0 && _shouldFetch
  const { data } = useSWRImmutable(
    shouldFetch ? ["roles", serverId] : null,
    fetchRoles
  )
  return data
}

export { fetchRoles }
export default useRoles
