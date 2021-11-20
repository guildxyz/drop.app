export type UserData = {
  id: string
  userName: string
  avatar: string
}

const fetchUserData = async (
  accessToken: string,
  tokenType: string
): Promise<UserData> => {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    },
  })

  if (!response.ok)
    throw new Error(
      "There was an error, while fetching user data, disable any extensions like privacy badgeractive on this site, as these block our request to discord"
    )

  const { id, username: userName, avatar: avatarHash } = await response.json()

  const avatar = `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.png`

  return { id, userName, avatar }
}

export default fetchUserData
