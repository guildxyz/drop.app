import { useDrop } from "components/[drop]/DropProvider"
import useSWRImmutable from "swr/immutable"
import useUserId from "../../../../hooks/useUserId"

const fetchUserRoles = (
  _: string,
  discordId: string,
  serverId: string
): Promise<Record<string, string>> =>
  fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/discord/roles/${discordId}/${serverId}`
  ).then((res) =>
    res.ok ? res.json() : Promise.reject(Error("Failed to fetch roles"))
  )

const useUserRoles = (): Record<string, string> => {
  const { serverId, platform } = useDrop()
  const userId = useUserId(platform)
  const shouldFetch = userId?.length > 0 && serverId?.length > 0

  const { data } = useSWRImmutable(
    shouldFetch ? ["userRoles", userId, serverId] : null,
    fetchUserRoles
  )

  return data
}

export { fetchUserRoles }
export default useUserRoles
