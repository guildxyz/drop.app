import useSWR from "swr"

const getRoleName = (_: string, serverId: string, roleId: string): Promise<string> =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/role/${serverId}/${roleId}`).then(
    (response) => (response.ok ? response.json() : Promise.reject(Error()))
  )

// platform parameter is only needed to avoid unnecessary requests from ClaimCard
const useRoleName = (
  serverId: string,
  roleId: string,
  platform: "TELEGRAM" | "DISCORD" = "DISCORD"
): string => {
  const shouldFetch =
    serverId?.length > 0 && roleId?.length > 0 && platform === "DISCORD"

  const { data } = useSWR(
    shouldFetch ? ["roleName", serverId, roleId] : null,
    getRoleName
  )

  return data
}

export default useRoleName
