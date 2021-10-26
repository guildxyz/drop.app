import { useMachine } from "@xstate/react"
import useToast from "hooks/useToast"
import getMachine, {
  Context,
  ErrorEvent,
  Event,
  State,
  SubmitEvent,
} from "./machine"

export type FetchMachine<SubmitData> = {
  onSubmit: (data: SubmitData) => void
  isLoading: boolean
  isSuccess: boolean
  state: State<SubmitData>
}

const useFetchMachine = <SubmitData>(
  fetcher: (context: Context, event: SubmitEvent<SubmitData>) => Promise<any>
): FetchMachine<SubmitData> => {
  const toast = useToast()

  const [state, send] = useMachine<Context, Event<SubmitData>>(
    getMachine<SubmitData>(),
    {
      services: { fetcher },
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
    }
  )

  const onSubmit = (data: SubmitData) => {
    console.log(data)
    send("START", { data })
  }

  return {
    onSubmit,
    isLoading: state.matches("fetching"),
    isSuccess: state.matches("success"),
    state,
  }
}

export default useFetchMachine
