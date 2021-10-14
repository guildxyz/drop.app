import { createMachine } from "xstate"

const machine = createMachine({
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
