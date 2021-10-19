import { useMachine } from "@xstate/react"
import useAirdrop from "hooks/useAirdrop"
import useToast from "hooks/useToast"
import machine, {
  Context,
  ErrorEvent,
  Event,
  StartAirdropData,
  StartEvent,
  State,
} from "./machine"

const useStartAirdropMachine = (): {
  onSubmit: (data: StartAirdropData) => void
  isLoading: boolean
  isSuccess: boolean
  state: State
} => {
  const { startAirdrop } = useAirdrop()
  const toast = useToast()

  const [state, send] = useMachine<Context, Event>(machine, {
    services: {
      startAirdrop: (
        _context,
        {
          data: {
            roles,
            serverId,
            name,
            channel,
            inputHashes,
            images,
            assetType,
            assetData,
            contractId,
          },
        }: StartEvent
      ) =>
        startAirdrop(
          name,
          channel,
          roles,
          serverId,
          images,
          inputHashes,
          assetType,
          assetData,
          contractId
        )(),
    },
    actions: {
      errorToast: (_context: unknown, event: ErrorEvent) => {
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

  const onSubmit = (data: StartAirdropData) => {
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

export default useStartAirdropMachine
