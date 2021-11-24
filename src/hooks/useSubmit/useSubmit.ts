import { useMachine } from "@xstate/react"
import usePersonalSign from "hooks/usePersonalSign"
import { State } from "xstate"
import createFetchMachine, { Context } from "./utils/fetchMachine"

type Options<ResponseType> = {
  onSuccess?: (response: ResponseType) => void
  onError?: (error: any) => void
}

type Submit<DataType, ResponseType> = {
  response?: ResponseType
  error?: string
  isLoading: boolean
  onSubmit: (data?: DataType) => State<Context<ResponseType>>
}

const useSubmit = <DataType, ResponseType>(
  fetch: (data: DataType) => Promise<ResponseType>,
  { onSuccess, onError }: Options<ResponseType> = {}
): Submit<DataType, ResponseType> => {
  const [state, send] = useMachine(createFetchMachine<DataType, ResponseType>(), {
    services: {
      fetch: (_context, event) => {
        // needed for typescript to ensure that event always has data property
        if (event.type !== "FETCH") return
        return fetch(event.data)
      },
    },
    actions: {
      onSuccess: (context) => {
        onSuccess?.(context.response)
      },
      onError: async (context) => {
        const err = await context.error
        onError?.(err)
      },
    },
  })

  return {
    ...state.context,
    onSubmit: (data?: DataType) => send({ type: "FETCH", data }),
    isLoading: state.matches("fetching"),
  }
}

type SignedMessage = {
  addressSignedMessage: string
}

const useSubmitWithSign = <DataType, ResponseType>(
  fetch: (data: DataType & SignedMessage) => Promise<ResponseType>,
  options: Options<ResponseType> = {}
) => {
  const { callbackWithSign } = usePersonalSign()
  return useSubmit<DataType, ResponseType>(callbackWithSign(fetch), options)
}

export default useSubmit
export { useSubmitWithSign }
