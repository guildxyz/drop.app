import useSWRImmutable from "swr/immutable"

const fetchUserRoles = (
  _: string,
  discordId: string,
  serverId: string
): Promise<Array<Record<string, string>>> =>
  fetch(
    `${process.env.NEXT_PUBLIC_DISCORD_API}/ranks/${discordId}/${serverId}`
  ).then((res) =>
    res.ok ? res.json() : Promise.reject(Error("Failed to fetch roles"))
  )

const useUserRoles = (
  userId: string,
  serverId: string
): Array<Record<string, string>> => {
  const shouldFetch = userId?.length > 0 && serverId?.length > 0

  const { data } = useSWRImmutable(
    shouldFetch ? ["userRoles", userId, serverId] : null,
    fetchUserRoles
  )

  return data
}

export { fetchUserRoles }
export default useUserRoles
