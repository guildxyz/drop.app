import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import claim from "contract_interactions/claim"
import useFetchMachine from "hooks/useFetchMachine"
import { FetchMachine } from "hooks/useFetchMachine/useFetchMachine"
import { SubmitEvent } from "hooks/useFetchMachine/utils/machine"

type ClaimData = {
  serverId: string
  roleId: string
  tokenAddress: string
}

const useClaim = (): FetchMachine<ClaimData> => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()

  return useFetchMachine<ClaimData>(
    "Claimed",
    async (
      _context,
      { data: { serverId, roleId, tokenAddress } }: SubmitEvent<ClaimData>
    ) =>
      claim(
        chainId,
        account,
        library.getSigner(account),
        roleId,
        serverId,
        tokenAddress,
        library
      )
  )
}

export default useClaim
