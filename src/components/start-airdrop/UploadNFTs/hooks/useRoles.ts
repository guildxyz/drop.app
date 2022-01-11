import { Platform } from "contract_interactions/types"
import useSWRImmutable from "swr/immutable"

const fetchRoles = (_: string, serverId: string): Promise<Record<string, string>> =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/discord/roles/${serverId}`).then(
    (response) =>
      response.ok ? response.json() : Promise.reject(Error("Failed to fetch roles"))
  )

const useRoles = (
  serverId: string,
  platform: Platform,
  shouldFetchProp = true,
  fallbackData?: Record<string, string>
): Record<string, string> => {
  const shouldFetch =
    typeof serverId === "string" &&
    serverId.length > 0 &&
    platform === "DISCORD" &&
    shouldFetchProp
  const { data } = useSWRImmutable(
    shouldFetch ? ["roles", serverId] : null,
    fetchRoles,
    { fallbackData, revalidateOnMount: true }
  )
  return data
}

export { fetchRoles }
export default useRoles
