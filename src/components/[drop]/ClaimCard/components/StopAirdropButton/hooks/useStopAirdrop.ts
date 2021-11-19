import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import stopAirdrop from "contract_interactions/stopAirdrop"
import useFetchMachine from "../../../../../../hooks/useFetchMachine"
import { FetchMachine } from "../../../../../../hooks/useFetchMachine/useFetchMachine"
import { SubmitEvent } from "../../../../../../hooks/useFetchMachine/utils/machine"

type StopAirdropData = {
  roleId: string
  serverId: string
  contractId: number
  urlName: string
}

const useStopAirdrop = (): FetchMachine<StopAirdropData> => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()

  return useFetchMachine<StopAirdropData>(
    "Airdrop stopped",
    async (
      _context,
      {
        data: { roleId, serverId, contractId, urlName },
      }: SubmitEvent<StopAirdropData>
    ) =>
      stopAirdrop(
        chainId,
        account,
        library.getSigner(account),
        serverId,
        urlName,
        roleId,
        contractId,
        library
      )
  )
}

export default useStopAirdrop
