import useAirdrop from "hooks/airdrop/useAirdrop"
import useFetchMachine, { FetchMachine } from "./useFetchMachine"
import { SubmitEvent } from "./useFetchMachine/machine"

type StartAirdropData = {
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

const useStartAirdropMachine = (): FetchMachine<StartAirdropData> => {
  const { startAirdrop } = useAirdrop()

  return useFetchMachine<StartAirdropData>(
    async (
      _context,
      {
        data: {
          roles,
          serverId,
          name,
          channel,
          inputHashes,
          images,
          assetType,
          contractId,
          traits,
        },
      }: SubmitEvent<StartAirdropData>
    ) =>
      startAirdrop(
        name,
        channel,
        roles,
        serverId,
        images,
        inputHashes,
        assetType,
        contractId,
        traits
      )
  )
}

export default useStartAirdropMachine
