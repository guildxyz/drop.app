const fetchIsOwner = (serverId: string, discordId: string): Promise<boolean> =>
  fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/owner/${serverId}/${discordId}`
  ).then((response) =>
    response.ok
      ? response.json()
      : Promise.reject(Error("Failed to fetch server owner"))
  )

export default fetchIsOwner
