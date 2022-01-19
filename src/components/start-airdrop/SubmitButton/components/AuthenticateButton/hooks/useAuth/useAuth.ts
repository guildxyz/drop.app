import { useWeb3React } from "@web3-react/core"
import { useSubmitWithSign } from "hooks/useSubmit"
import { useRef } from "react"
import { mutate } from "swr"
import { UserData } from "utils/fetchUserData"
import authenticate from "./utils/authenticate"
import handleMessage from "./utils/handleMessage"

const useAuth = () => {
  const { account } = useWeb3React()
  const authWindow = useRef<Window>(null)
  const listener = useRef<(event: MessageEvent) => void>()

  const openWindow = () => {
    authWindow.current = window.open(
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&scope=identify&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}`,
      "dc_auth",
      `height=750,width=600,scrollbars`
    )

    // Could only capture a "beforeunload" event if the popup and the opener would be on the same domain
    const timer = setInterval(() => {
      if (authWindow.current.closed) {
        clearInterval(timer)
        window.postMessage(
          {
            type: "DC_AUTH_ERROR",
            data: {
              name: "Authorization rejected",
              description:
                "Please try again and authenticate your Discord account in the popup window",
            },
          },
          window.origin
        )
      }
    }, 500)
  }

  const closeWindow = () => {
    window.removeEventListener("message", listener.current)
    listener.current = null
    authWindow.current.close()
  }

  const fetcher = async ({ addressSignedMessage }) => {
    openWindow()
    const { id } = await new Promise<UserData>((resolve, reject) => {
      listener.current = handleMessage(resolve, reject)
      window.addEventListener("message", listener.current)
    })
    closeWindow()
    await authenticate(id, account, addressSignedMessage, "DISCORD")
    await mutate(["userId", account, "DISCORD"])
    return true
  }

  const {
    isLoading,
    onSubmit: onAuthenticate,
    response,
  } = useSubmitWithSign(fetcher)
  const isSuccess = !!response

  return {
    isLoading,
    isSuccess,
    onAuthenticate,
  }
}

export default useAuth
