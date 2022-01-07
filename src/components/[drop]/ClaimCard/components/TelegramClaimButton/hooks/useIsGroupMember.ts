import { Platform } from "contract_interactions/types"
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
      response
        .json()
        .then((body) =>
          response.ok
            ? body
            : body.code === "BOT_IS_NOT_MEMBER"
            ? null
            : Promise.reject(body)
        )
    )
    .catch((error) => Promise.reject({ message: error.message ?? "Unknown error" }))

const useIsGroupMember = (serverId: string, platform: Platform) => {
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
