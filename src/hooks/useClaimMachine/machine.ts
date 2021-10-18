import BackendError from "utils/errors/BackendError"
import SignError from "utils/errors/SignError"
import TransactionError from "utils/errors/TransactionError"
import { createMachine, DoneInvokeEvent, State as XStateState } from "xstate"

export type ClaimData = {
  serverId: string
  roleId: string
  tokenAddress: string
}

export type Context = Record<string, unknown>
export type ErrorEvent = DoneInvokeEvent<
  SignError | TransactionError | BackendError | Error
>
export type StartEvent = DoneInvokeEvent<ClaimData>
export type Event = ErrorEvent | StartEvent
export type State = XStateState<Context, Event>

const machine = createMachine<Context, Event>({
  initial: "idle",
  states: {
    idle: {
      on: {
        CLAIM: "fetching",
      },
    },
    fetching: {
      invoke: {
        src: "claim",
        onDone: "success",
        onError: "error",
      },
    },
    error: {
      entry: "errorToast",
      on: {
        CLAIM: "fetching",
      },
    },
    success: {
      entry: "successToast",
    },
  },
})

export default machine
