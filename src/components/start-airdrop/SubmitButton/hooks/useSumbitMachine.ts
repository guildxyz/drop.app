import { useMachine } from "@xstate/react"
import useToast from "hooks/useToast"
import { assign, createMachine } from "xstate"
import useShowErrorToast from "./useShowErrorToast"

type SubmitMachine = {
  onSubmit: (data: any) => void
  isLoading: boolean
  isSuccess: boolean
}

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

const useSubmitMachine = (): SubmitMachine => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

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
