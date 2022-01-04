import useUserId from "./useUserId"

const useIsAuthenticated = (platform: "DISCORD" | "TELEGRAM"): boolean => {
  const discordId = useUserId(platform)
  if (discordId === undefined) return undefined
  else return discordId.length > 0
}

export default useIsAuthenticated
