import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import startAirdrop from "contract_interactions/startAirdrop"
import useFetchMachine, { FetchMachine } from "./useFetchMachine"
import { SubmitEvent } from "./useFetchMachine/machine"

export type StartAirdropData = {
  name: string
  urlName: string
  channel: string
  assetType: "NFT" | "TOKEN" | "ERC1155"
  serverId: string
  roles: Record<
    string,
    {
      image: FileList
      ipfsHash: string
      traits: Record<string, string>
      traitKeyIds: Record<string, string>
    }
  >
  contractId: string
}

const useStartAirdropMachine = (): FetchMachine<StartAirdropData> => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()

  return useFetchMachine<StartAirdropData>(
    "Airdrop started",
    async (
      _context,
      {
        data: { roles, serverId, name, channel, assetType, contractId, urlName },
      }: SubmitEvent<StartAirdropData>
    ) =>
      startAirdrop(chainId, account, library.getSigner(account).connectUnchecked(), {
        name,
        urlName,
        channel,
        roles,
        serverId,
        assetType,
        contractId,
      })
  )
}

export default useStartAirdropMachine
