import { useMachine } from "@xstate/react"
import usePersonalSign from "hooks/usePersonalSign"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"
import { assign, createMachine } from "xstate"
import useShowErrorToast from "./useShowErrorToast"

const machine = createMachine(
  {
    initial: "idle",
    states: {
      idle: {},
    },
  },
  {
    actions: {
      saveData: assign((_, { data }: any) => ({
        data,
      })),
    },
  }
)

const useSubmitMachine = () => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()
  const { addressSignedMessage } = usePersonalSign()

  const [state, send] = useMachine(machine, {
    services: {},
    actions: {
      showErrorToast: (_context, { data: error }: any) => {
        if (error instanceof Error) showErrorToast(error.message)
        else showErrorToast(error.errors)
      },
      showSuccessToast: () => {
        toast({
          title: "Airdrop started!",
          status: "success",
          duration: 4000,
        })
      },
    },
  })

  const onSubmit = (data) => {
    console.log("data")
    console.log(data)
    send("SUBMIT", { data })
  }

  return {
    onSubmit,
    isLoading: ["fetchCommunity", "fetchLevels", "parseError"].some(state.matches),
    isSuccess: state.matches("success"),
  }
}

export default useSubmitMachine
