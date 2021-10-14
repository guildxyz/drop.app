import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"

const fetchDiscordID = (_: string, address: string) =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/discordId/${address}`).then((res) =>
    res.ok ? res.json() : Promise.reject(Error("Failed to fetch discord id"))
  )

const useDiscordId = () => {
  const { account } = useWeb3React()

  const shouldFetch = account?.length > 0

  const { data } = useSWRImmutable(
    shouldFetch ? ["discordId", account] : null,
    fetchDiscordID
  )

  return data
}

export { fetchDiscordID }
export default useDiscordId
