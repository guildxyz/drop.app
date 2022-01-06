import { useDrop } from "components/[drop]/DropProvider"
import useUserId from "hooks/useUserId"
import useSWR from "swr"

const fetchIsGroupMember = (
  _: string,
  groupId: string,
  userId: string
): Promise<boolean> =>
  fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/member/${groupId}/${userId}`
  )
    .then((response) =>
      response.json().then((body) => (response.ok ? body : Promise.reject(body)))
    )
    .catch((error) => Promise.reject({ message: error.message ?? "Unknown error" }))

const useIsGroupMember = () => {
  const { serverId, platform } = useDrop()
  const userId = useUserId(platform)
  const shouldFetch = serverId?.length > 0 && userId?.length > 0
  const { data } = useSWR(
    shouldFetch ? ["isGroupMember", serverId, userId] : null,
    fetchIsGroupMember
  )

  return data
}

export { fetchIsGroupMember }
export default useIsGroupMember
