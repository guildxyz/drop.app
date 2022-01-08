import { Platform } from "contract_interactions/types"
import useSWR from "swr"

const fetchHasAccess = (_: string, communityId: string, platform: Platform) =>
  platform === "TELEGRAM"
    ? fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/has-access/${communityId}`
      ).then((response) =>
        response.json().then((body) => (response.ok ? body : Promise.reject(body)))
      )
    : fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/has-access/${communityId}`).then(
        (response) =>
          response.json().then((body) => (response.ok ? body : Promise.reject(body)))
      )

const useHasAccess = (
  communityId: string,
  platform: Platform,
  fallbackData: boolean
) => {
  const shouldFetch = communityId?.length > 0
  const { data } = useSWR(
    shouldFetch ? ["hasAccess", communityId, platform] : null,
    fetchHasAccess,
    { fallbackData }
  )

  return data
}

export { fetchHasAccess }
export default useHasAccess
