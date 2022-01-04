import useSWR from "swr"
import useUserId from "./useUserId"

const getServersOfUser = (_: string, userId: string): Promise<string[]> =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/servers/${userId}`).then(
    (response) => (response.ok ? response.json() : Promise.reject(new Error()))
  )

// TODO: We need a similar hook for groups of user
const useServersOfUser = (): string[] => {
  const discordId = useUserId("DISCORD")

  const shouldFetch = discordId?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["serversOfUser", discordId] : null,
    getServersOfUser
  )

  return data
}

export default useServersOfUser
