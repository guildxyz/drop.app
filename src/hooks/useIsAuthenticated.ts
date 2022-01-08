import { Platform } from "contract_interactions/types"
import useUserId from "./useUserId"

const useIsAuthenticated = (platform: Platform): boolean => {
  const discordId = useUserId(platform)
  if (discordId === undefined) return undefined
  else return discordId.length > 0
}

export default useIsAuthenticated
