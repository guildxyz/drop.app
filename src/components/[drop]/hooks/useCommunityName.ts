import { Platform } from "contract_interactions/types"
import useGroupName from "hooks/useGroupName"
import useServerData from "hooks/useServerData"
import { useMemo } from "react"

const useCommunityName = (communityId: string, platform: Platform) => {
  const { name: serverName } = useServerData(communityId, platform)
  const groupName = useGroupName(communityId, platform)
  return useMemo(
    () =>
      serverName?.length > 0 ? serverName : groupName?.length > 0 ? groupName : "",
    [serverName, groupName]
  )
}

export default useCommunityName
