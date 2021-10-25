import { createMachine } from "xstate"
import type { Context, Event } from "./types"

const getMachine = <FetchedData>() =>
  createMachine<Context, Event<FetchedData>>({
    initial: "idle",
    states: {
      idle: {
        on: {
          AUTH: "authenticating",
        },
      },
      authenticating: {
        entry: "openWindow",
        invoke: {
          src: "auth",
          onDone: "fetching",
          onError: "error",
        },
        exit: "closeWindow",
      },
      fetching: {
        invoke: {
          src: "fetcher",
          onDone: "success",
          onError: "error",
        },
      },
      error: {
        entry: "showErrorToast",
        on: {
          AUTH: "authenticating",
        },
      },
      success: {},
    },
  })

export default getMachine
