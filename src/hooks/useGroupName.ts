import useSWR from "swr"

const fetchGroupName = (_: string, chatId: string) =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/chat-name/${chatId}`).then(
    (res) => res.json().then((body) => (res.ok ? body : Promise.reject(body)))
  )

const useGroupName = (chatId: string, platform: "TELEGRAM" | "DISCORD") => {
  const shouldFetch = chatId?.length > 0 && platform === "TELEGRAM"
  const { data } = useSWR(shouldFetch ? ["groupName", chatId] : null, fetchGroupName)
  return data
}

export default useGroupName
