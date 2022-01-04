import { fetchIsGroupMember } from "components/[drop]/ClaimCard/components/TelegramClaimButton/hooks/useIsGroupMember"
import useSWR from "swr"
import useUserId from "./useUserId"

const fetchGroupsOfUser = (_: string, groupIds: string[], userId: string) =>
  Promise.all(
    groupIds.map((groupId) =>
      fetchIsGroupMember("", groupId, userId).catch(() => false)
    )
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
