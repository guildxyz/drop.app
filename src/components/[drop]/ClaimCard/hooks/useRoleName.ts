import { useDrop } from "components/[drop]/DropProvider"
import useSWR from "swr"

const getRoleName = (_: string, serverId: string, roleId: string): Promise<string> =>
  fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/discord/role/${serverId}/${roleId}`
  ).then((response) => (response.ok ? response.json() : Promise.reject(Error())))

const useRoleName = (roleId: string): string => {
  const { serverId, platform } = useDrop()

  const shouldFetch =
    serverId?.length > 0 && roleId?.length > 0 && platform === "DISCORD"

  const { data } = useSWR(
    shouldFetch ? ["roleName", serverId, roleId] : null,
    getRoleName
  )

  return data
}

export default useRoleName
