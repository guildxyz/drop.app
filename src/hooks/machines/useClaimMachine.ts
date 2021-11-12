import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import claim from "contract_interactions/claim"
import useDiscordId from "hooks/discord/useDiscordId"
import useFetchMachine, { FetchMachine } from "./useFetchMachine"
import { SubmitEvent } from "./useFetchMachine/machine"

type ClaimData = {
  serverId: string
  roleId: string
  tokenAddress: string
}

const useClaimMachine = (): FetchMachine<ClaimData> => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const discordId = useDiscordId()

  return useFetchMachine<ClaimData>(
    "Claimed",
    async (
      _context,
      { data: { serverId, roleId, tokenAddress } }: SubmitEvent<ClaimData>
    ) =>
      claim(
        chainId,
        account,
        library.getSigner(account).connectUnchecked(),
        roleId,
        serverId,
        tokenAddress,
        discordId
      )
  )
}

export default useClaimMachine
