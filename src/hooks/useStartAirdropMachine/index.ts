import { useMachine } from "@xstate/react"
import useAirdrop from "hooks/useAirdrop"
import useToast from "hooks/useToast"
import BackendError from "utils/errors/BackendError"
import SignError from "utils/errors/SignError"
import TransactionError from "utils/errors/TransactionError"
import { DoneInvokeEvent } from "xstate"
import machine from "./machine"

type StartAirdropData = {
  name: string
  roles: string[]
  serverId: string
}

const useStartAirdropMAchine = () => {
  const { startAirdrop } = useAirdrop()
  const toast = useToast()

  const [state, send] = useMachine(machine, {
    services: {
      startAirdrop: async (
        _context,
        { data: { roles, serverId, name, channel, inputHashes, images } }
      ) => {
        console.log("TODO: use name and channel here with new contract")
        return startAirdrop(roles, serverId, images, inputHashes)()
      },
    },
    actions: {
      errorToast: (
        _context: unknown,
        event: DoneInvokeEvent<SignError | TransactionError | BackendError | Error>
      ) => {
        try {
          const messages = JSON.parse(event.data.message)
          if (Array.isArray(messages))
            messages.forEach((error) =>
              toast({
                title: error.key || "Error",
                description: error.message,
                status: "error",
              })
            )
          else throw Error("")
        } catch {
          toast({
            title: event.data.name,
            description: event.data.message,
            status: "error",
          })
        }
      },

      successToast: () =>
        toast({
          title: "Success",
          description: "Airdrop started",
          status: "success",
        }),
    },
  })

  const onSubmit = (data) => {
    console.log(data)
    send("START_AIRDROP", { data })
  }

  return {
    onSubmit,
    isLoading: state.matches("fetching"),
    isSuccess: state.matches("success"),
    state,
  }
}

export default useStartAirdropMAchine
