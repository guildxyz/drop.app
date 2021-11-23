import { fetchDiscordID } from "hooks/useDiscordId"

const isAuthenticated = async (
  userId: string,
  address: string
): Promise<boolean> => {
  try {
    const idFromDB = await fetchDiscordID("discordId", address)
    return userId === idFromDB
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default isAuthenticated
