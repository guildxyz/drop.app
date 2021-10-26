import BackendError from "utils/errors/BackendError"
import SignError from "utils/errors/SignError"
import TransactionError from "utils/errors/TransactionError"
import {
  createMachine,
  DoneInvokeEvent,
  State as XStateState,
  StateMachine,
  StateSchema,
} from "xstate"

export type Context = Record<string, unknown>
export type ErrorEvent = DoneInvokeEvent<
  SignError | TransactionError | BackendError | Error
>
export type SubmitEvent<SumbitData> = DoneInvokeEvent<SumbitData>
export type Event<SumbitData> = ErrorEvent | SubmitEvent<SumbitData>
export type State<SubmitData> = XStateState<Context, Event<SubmitData>>

const getMachine = <SubmitData>(): StateMachine<
  Context,
  StateSchema,
  Event<SubmitData>
> =>
  createMachine<Context, Event<SubmitData>>({
    initial: "idle",
    states: {
      idle: {
        on: {
          START: "fetching",
        },
      },
      fetching: {
        invoke: {
          src: "fetcher",
          onDone: "success",
          onError: "error",
        },
      },
      error: {
        entry: "errorToast",
        on: {
          START: "fetching",
        },
      },
      success: {
        entry: "successToast",
      },
    },
  })

export default getMachine
