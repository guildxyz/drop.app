import useSWRImmutable from "swr/immutable"
import useDiscordId from "../../../../hooks/useDiscordId"

const fetchUserRoles = (
  _: string,
  discordId: string,
  serverId: string
): Promise<Array<Record<string, string>>> =>
  fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/ranks/${discordId}/${serverId}`
  ).then((res) =>
    res.ok ? res.json() : Promise.reject(Error("Failed to fetch roles"))
  )

const useUserRoles = (
  serverId: string,
  userId?: string
): Array<Record<string, string>> => {
  const userIdOfConnectedWallet = useDiscordId()
  const discordId = userId ? userId : userIdOfConnectedWallet
  const shouldFetch = discordId?.length > 0 && serverId?.length > 0

  const { data } = useSWRImmutable(
    shouldFetch ? ["userRoles", discordId, serverId] : null,
    fetchUserRoles
  )

  return data
}

export { fetchUserRoles }
export default useUserRoles
