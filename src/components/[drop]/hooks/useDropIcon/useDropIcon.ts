import useGroupImage from "components/[drop]/hooks/useDropIcon/hooks/useGroupImage"
import { Platform } from "contract_interactions/types"
import useServerImage from "./hooks/useServerImage"

const useDropIcon = (serverId: string, fallbackData: string, platform: Platform) => {
  const serverImage = useServerImage(serverId, fallbackData, platform)
  const groupImage = useGroupImage(serverId, fallbackData, platform)
  return serverImage ?? groupImage ?? "/svg/discord-logo.svg"
}

export default useDropIcon
