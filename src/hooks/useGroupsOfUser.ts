import { fetchIsGroupMember } from "components/[drop]/ClaimCard/components/TelegramClaimButton/hooks/useIsGroupMember"
import useUserId from "hooks/useUserId"
import useSWR from "swr"

const fetchGroupsOfUser = (_: string, groupIds: string[], userId: string) =>
  Promise.all(
    groupIds.map((groupId) =>
      fetchIsGroupMember("", groupId, userId).catch(() => false)
    )
  ).then((results) =>
    Object.fromEntries(groupIds.map((groupId, index) => [groupId, results[index]]))
  )

const useGroupsOfUser = (groupIds: string[]) => {
  const userId = useUserId("TELEGRAM")
  const shouldFetch = userId?.length >= 0
  const { data } = useSWR(
    shouldFetch ? ["groupsOfUser", groupIds, userId] : null,
    fetchGroupsOfUser
  )
  return data
}

export default useGroupsOfUser
