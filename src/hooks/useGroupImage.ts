import useSWR from "swr"

const fetchGroupImage = (_: string, chatId: string) =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/chat-avatar/${chatId}`)
    .then((response) =>
      response.json().then((body) => (response.ok ? body : Promise.reject(body)))
    )
    .catch((error) => Promise.reject({ message: error.message ?? "Unknown error" }))

const useGroupImage = (
  chatId: string,
  fallbackData: string,
  platform: "TELEGRAM" | "DISCORD" = "TELEGRAM"
) => {
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
