import { useMachine } from "@xstate/react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  createMachine,
  DoneInvokeEvent,
  EventData,
  State as XStateState,
} from "xstate"

type Context = Record<string, unknown>
type Event = DoneInvokeEvent<string>

export type State = XStateState<Context, Event>
export type Send = (event: string, payload?: EventData) => State
type Machine = [State, Send]

const useMetaDataKeysMachine = (): Machine => {
  const { setValue } = useFormContext()
  const metaDataKeys = useWatch({ name: "metaDataKeys", defaultValue: [] })

  const [state, send] = useMachine<Context, Event>(machine, {
    actions: {
      appendKey: (_context, { data }: Event) =>
        setValue("metaDataKeys", [...metaDataKeys, data]),
    },
  })

  return [state, send]
}

const machine = createMachine<Context, Event>({
  initial: "idle",
  states: {
    idle: {
      on: {
        START: "showInput",
      },
    },
    showInput: {
      on: {
        ADD: {
          target: "idle",
          actions: "appendKey",
        },
      },
    },
  },
})

export default useMetaDataKeysMachine
