import useSWR from "swr"
import BackendError from "utils/errors/BackendError"
import useDiscordId from "./useDiscordId"

const getServersOfUser = (_: string, userId: string): Promise<string[]> =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/servers/${userId}`).then(
    (response) =>
      response.ok ? response.json() : Promise.reject(new BackendError())
  )

const useServersOfUser = (): string[] => {
  const userId = useDiscordId()

  const shouldFetch = userId?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["serversOfUser", userId] : null,
    getServersOfUser
  )

  return data
}

export default useServersOfUser
