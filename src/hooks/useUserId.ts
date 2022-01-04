import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"

// TODO: After API refactor, we can just `${process.env.NEXT_PUBLIC_BACKEND_API}/${plaftorm.toLowerCase()}/id/${address}`
const fetchUserId = (
  _: string,
  address: string,
  platform: "TELEGRAM" | "DISCORD"
): Promise<string> => {
  console.log(_, address, platform)
  return platform === "DISCORD"
    ? fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/discordId/${address}`).then(
        (res) =>
          res.ok ? res.json() : Promise.reject(Error("Failed to fetch discord id"))
      )
    : fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/id/${address}`).then(
        (res) =>
          res.ok ? res.json() : Promise.reject(Error("Failed to fetch telegram id"))
      )
}

const useUserId = (platform: "DISCORD" | "TELEGRAM"): string => {
  const { account } = useWeb3React()

  const shouldFetch = account?.length > 0 && platform?.length > 0

  const { data } = useSWRImmutable(
    shouldFetch ? ["userId", account, platform] : null,
    fetchUserId
  )

  return data
}

export { fetchUserId }
export default useUserId
