import { useWeb3React } from "@web3-react/core"
import { Platform } from "contract_interactions/types"
import useSWRImmutable from "swr/immutable"

const fetchUserId = (
  _: string,
  address: string,
  platform: Platform
): Promise<string> =>
  fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/${platform.toLowerCase()}/id/${address}`
  ).then((res) =>
    res.ok ? res.json() : Promise.reject(Error("Failed to fetch telegram id"))
  )

const useUserId = (platform: Platform): string => {
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
