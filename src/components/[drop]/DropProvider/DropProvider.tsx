import useRolesData from "components/index/DropCard/hooks/useRolesData"
import { DropWithRoles } from "contract_interactions/getDropRolesData"
import useHasAccess from "hooks/useHasAccess"
import { createContext, PropsWithChildren, useContext } from "react"
import useCommunityName from "../hooks/useCommunityName"
import useDropIcon from "../hooks/useDropIcon"

type Props = {
  drop: DropWithRoles
}

const DropContext = createContext<DropWithRoles>(null)

const DropProvider = ({ drop, children }: PropsWithChildren<Props>) => {
  const {
    serverId,
    platform,
    tokenAddress,
    urlName,
    roles: initialRoles,
    communityImage: initialCommunityImage,
    communityName: initialCommunityName,
    hasAccess: initialHasAccess,
  } = drop

  const hasAccess = useHasAccess(serverId, platform, initialHasAccess)
  // useDropIcon and useCommunityName could be just 1-1 SWR hook (instead of each calling two others for the two platforms)?
  const communityImage = useDropIcon(
    serverId,
    initialCommunityImage,
    platform,
    hasAccess
  )
  const communityName = useCommunityName(serverId, initialCommunityName, platform)
  const roles = useRolesData(serverId, tokenAddress, platform, urlName, initialRoles)

  return (
    <DropContext.Provider
      value={{ ...drop, communityImage, communityName, hasAccess, roles }}
    >
      {children}
    </DropContext.Provider>
  )
}

const useDrop = () => useContext(DropContext)

export { useDrop }
export default DropProvider
