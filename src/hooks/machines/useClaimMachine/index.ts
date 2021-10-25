import { useMachine } from "@xstate/react"
import useAirdrop from "hooks/useAirdrop"
import useToast from "hooks/useToast"
import machine, {
  ClaimData,
  Context,
  ErrorEvent,
  Event,
  StartEvent,
  State,
} from "./machine"

const useClaimMachine = (): {
  onSubmit: (data: ClaimData) => void
  isLoading: boolean
  isSuccess: boolean
  state: State
} => {
  const { claim } = useAirdrop()
  const toast = useToast()

  const [state, send] = useMachine<Context, Event>(machine, {
    services: {
      claim: async (
        _context,
        { data: { serverId, roleId, tokenAddress } }: StartEvent
      ) => {
        const tx = await claim(roleId, serverId, tokenAddress)()
        await tx.wait()
        return tx
      },
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

  const onSubmit = (data: ClaimData) => {
    console.log(data)
    send("CLAIM", { data })
  }

  return {
    onSubmit,
    isLoading: state.matches("fetching"),
    isSuccess: state.matches("success"),
    state,
  }
}

export default useClaimMachine
