import { Platform } from "contract_interactions/types"
import { fetchHasAccess } from "hooks/useHasAccess"
import useSWR from "swr"

const fetchGroupImage = (_: string, chatId: string) =>
  fetchHasAccess("", chatId, "TELEGRAM").then((hasAccess) =>
    hasAccess
      ? fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/chat-avatar/${chatId}`
        ).then((response) =>
          response.json().then((body) => (response.ok ? body : ""))
        )
      : ""
  )

const useGroupImage = (chatId: string, fallbackData: string, platform: Platform) => {
  const shouldFetch = chatId?.length > 0 && platform === "TELEGRAM"
  const { data } = useSWR(
    shouldFetch ? ["groupImage", chatId] : null,
    fetchGroupImage,
    { fallbackData, revalidateOnMount: true }
  )

  return data
}

export { fetchGroupImage }
export default useGroupImage
