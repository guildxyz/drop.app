import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import useAirdrop from "hooks/useAirdrop"
import useToast from "hooks/useToast"
import BackendError from "utils/errors/BackendError"
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
  const { account } = useWeb3React()
  const { startAirdrop, contractsByDeployer } = useAirdrop()
  const toast = useToast()

  const [state, send] = useMachine<Context, Event>(machine, {
    services: {
      startAirdrop: async (
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
          },
        }: StartEvent
      ) => {
        const contractId = await startAirdrop(
          name,
          channel,
          roles,
          serverId,
          images,
          inputHashes,
          assetType,
          assetData
        )()

        const contractAddress = await contractsByDeployer(account, contractId)

        const createResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/airdrop`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, serverId, roles, contractAddress }),
          }
        )
        if (!createResponse.ok) throw new BackendError("Failed to save airdrop data")
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
