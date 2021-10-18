import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import useAirdrop from "./useAirdrop"

const getClaims = (
  _: string,
  address: string,
  serverId: string,
  roleId: string,
  tokenAddress: string,
  claims: (
    address: string,
    serverId: string,
    roleId: string,
    tokenAddress: string
  ) => Promise<{ claimed: boolean; approved: boolean }>
) => claims(address, serverId, roleId, tokenAddress).then(({ claimed }) => claimed)

const useIsClaimed = (
  serverId: string,
  roleId: string,
  tokenAddress: string
): boolean => {
  const { account } = useWeb3React()
  const { claims } = useAirdrop()
  const shouldFetch =
    !!claims &&
    serverId?.length > 0 &&
    roleId?.length > 0 &&
    tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["isClaimed", account, serverId, roleId, tokenAddress, claims]
      : null,
    getClaims
  )

  return data
}

export default useIsClaimed
