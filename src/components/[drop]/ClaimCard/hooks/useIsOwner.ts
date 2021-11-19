import useDiscordId from "hooks/useDiscordId"
import useOwnerId from "./useOwnerId"

const useIsOwner = (serverId: string): boolean => {
  const ownerId = useOwnerId(serverId)
  const discordId = useDiscordId()
  if (ownerId === undefined || discordId === undefined) return undefined
  return ownerId === discordId
}

export default useIsOwner
