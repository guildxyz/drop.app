import BackendError from "utils/errors/BackendError"
import SignError from "utils/errors/SignError"
import TransactionError from "utils/errors/TransactionError"
import { createMachine, DoneInvokeEvent, State as XStateState } from "xstate"

export type StartAirdropData = {
  name: string
  channel: string
  assetType: "NFT" | "TOKEN" | "ERC1155"
  // TODO: Make a union type for the 3 assets (when they are supported)
  assetData: {
    name: string
    symbol: string
  }
  serverId: string
  roles: string[]
  images: Record<string, File>
  inputHashes: Record<string, string>
  contractId: string
  traits: Record<string, Record<string, string>>
}

export type Context = Record<string, unknown>
export type ErrorEvent = DoneInvokeEvent<
  SignError | TransactionError | BackendError | Error
>
export type StartEvent = DoneInvokeEvent<StartAirdropData>
export type Event = ErrorEvent | StartEvent
export type State = XStateState<Context, Event>

const machine = createMachine<Context, Event>({
  initial: "idle",
  states: {
    idle: {
      on: {
        START_AIRDROP: "fetching",
      },
    },
    fetching: {
      invoke: {
        src: "startAirdrop",
        onDone: "success",
        onError: "error",
      },
    },
    error: {
      entry: "errorToast",
      on: {
        START_AIRDROP: "fetching",
      },
    },
    success: {
      entry: "successToast",
    },
  },
})

export default machine
