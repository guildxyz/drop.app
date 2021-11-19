import DiscordError from "utils/errors/DiscordError"
import type { DoneInvokeEvent, EventData, State as XStateState } from "xstate"

export type Context = unknown

// Data
export type DiscordData = {
  tokenType: string
  accessToken: string
}

// Events
export type Event<FetchedData> = DoneInvokeEvent<{
  auth?: DiscordData
  error?: DiscordError
  data?: FetchedData
}>

// Machine
export type State<FetchedData> = XStateState<Context, Event<FetchedData>>
export type Send<FetchedData> = (
  event: string,
  payload?: EventData
) => XStateState<Context, Event<FetchedData>>
export type Machine<FetchedData> = [State<FetchedData>, Send<FetchedData>]
