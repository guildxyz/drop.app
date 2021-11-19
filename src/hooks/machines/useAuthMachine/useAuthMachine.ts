import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import usePersonalSign from "hooks/usePersonalSign"
import useToast from "hooks/useToast"
import { useRef } from "react"
import authenticate from "utils/discord/authenticate"
import { UserData } from "utils/discord/fetchUserData"
import handleMessage from "./utils/handleMessage"
import getMachine from "./utils/machine"
import type { Context, Event, State } from "./utils/types"

type AuthMachine = {
  state: State<UserData>
  isLoading: boolean
  isSuccess: boolean
  authenticate: () => void
}

const useAuthMachine = (): AuthMachine => {
  const { addressSignedMessage } = usePersonalSign(true)
  const { account } = useWeb3React()
  const authWindow = useRef<Window>(null)
  const listener = useRef<(event: MessageEvent) => void>()
  const toast = useToast()

  const [state, send] = useMachine(getMachine<UserData>(), {
    actions: {
      openWindow: () => {
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
      },

      closeWindow: () => {
        window.removeEventListener("message", listener.current)
        listener.current = null
        authWindow.current.close()
      },

      showErrorToast: (_context: Context, event: Event<UserData>) =>
        toast({
          status: "error",
          title: event.data.error.name,
          description: event.data.error.message,
        }),

      showSuccessToast: () =>
        toast({
          status: "success",
          title: "Success",
          description: "Authentication successful",
        }),
    },
    services: {
      fetcher: (_context: Context, event: Event<UserData>) =>
        authenticate(event, account, addressSignedMessage),
      auth: () =>
        new Promise((resolve, reject) => {
          listener.current = handleMessage(resolve, reject)
          window.addEventListener("message", listener.current)
        }),
    },
  })

  return {
    isLoading: state.matches("fetching") || state.matches("authenticating"),
    isSuccess: state.matches("success"),
    authenticate: () => send("AUTH"),
    state,
  }
}

export default useAuthMachine
