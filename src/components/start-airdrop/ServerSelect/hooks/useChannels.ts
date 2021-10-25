import useSWR from "swr"

type ChannelsData = {
  serverId: string
  channels: string[]
}

type Channels = [ChannelsData, boolean]

const fallbackData = {
  serverId: null,
  channels: null,
}

const getChannels = (_: string, invite: string) =>
  fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/channels/${invite.split("/").at(-1)}`
  ).then((response) => (response.ok ? response.json() : fallbackData))

const useChannels = (invite: string): Channels => {
  const shouldFetch = invite?.length >= 5

  const { data, isValidating } = useSWR(
    shouldFetch ? ["serverData", invite] : null,
    getChannels,
    {
      fallbackData: {
        serverId: undefined,
        channels: undefined,
      },
    }
  )

  return [data, isValidating]
}

export default useChannels
