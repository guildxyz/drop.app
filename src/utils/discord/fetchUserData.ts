import { Event } from "hooks/machines/useAuthMachine/utils/types"
import BackendError from "utils/errors/BackendError"

export type UserData = {
  id: string
  userName: string
  avatar: string
}

const fetchUserData = async (
  event: Event<UserData>
): Promise<{ data: UserData }> => {
  const { tokenType, accessToken } = event.data.auth

  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    },
  })

  if (!response.ok)
    Promise.reject({
      error: new BackendError("There was an error, while fetching the user data"),
    })

  const { id, username: userName, avatar: avatarHash } = await response.json()

  const avatar = `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.png`

  return { data: { id, userName, avatar } }
}

export default fetchUserData
