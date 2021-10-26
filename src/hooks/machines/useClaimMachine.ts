import useAirdrop from "hooks/airdrop/useAirdrop"
import useFetchMachine, { FetchMachine } from "./useFetchMachine"
import { SubmitEvent } from "./useFetchMachine/machine"

type ClaimData = {
  serverId: string
  roleId: string
  tokenAddress: string
}

const useClaimMachine = (): FetchMachine<ClaimData> => {
  const { claim } = useAirdrop()

  return useFetchMachine<ClaimData>(
    async (
      _context,
      { data: { serverId, roleId, tokenAddress } }: SubmitEvent<ClaimData>
    ) => claim(roleId, serverId, tokenAddress)
  )
}

export default useClaimMachine
