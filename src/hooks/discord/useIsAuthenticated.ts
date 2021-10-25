import useDiscordId from "./useDiscordId"

const useIsAuthenticated = (): boolean => {
  const discordId = useDiscordId()
  if (discordId === undefined) return undefined
  else return discordId.length > 0
}

export default useIsAuthenticated
