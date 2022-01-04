import useSWR from "swr"

const fetchGroupImage = (_: string, chatId: string) =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/chat-avatar/${chatId}`)
    .then((response) =>
      response.json().then((body) =>
        response.ok
          ? fetch(
              `https://api.telegram.org/file/bot5099341542:AAFArM0ij5nsWAW1SQPbCGm_GyY1YMfloNE/${body}`
            )
              .then((imgRes) =>
                imgRes
                  .arrayBuffer()
                  .then(
                    (arrayBuffer) =>
                      `data:image/${body.split(".").pop()};base64,${Buffer.from(
                        arrayBuffer
                      ).toString("base64")}`
                  )
              )
              .catch((e) => {
                console.error(e)
                return ""
              })
          : Promise.reject(body)
      )
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
