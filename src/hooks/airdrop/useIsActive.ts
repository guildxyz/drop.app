import useSWR from "swr"
import useAirdrop from "./useAirdrop"

const getIsActive = async (
  _: string,
  claimables: (
    serverId: string,
    roleId: string,
    tokenAddress: string
  ) => Promise<{ active: boolean; dropped: boolean }>,
  serverId: string,
  roleId: string,
  tokenAddress: string
) => claimables(serverId, roleId, tokenAddress).then(({ dropped }) => dropped)

const useIsActive = (
  serverId: string,
  roleId: string,
  tokenAddress: string
): boolean => {
  const { claimables } = useAirdrop()

  const shouldFetch =
    !!claimables &&
    serverId?.length > 0 &&
    roleId?.length > 0 &&
    tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["claimableRoles", claimables, serverId, roleId, tokenAddress]
      : null,
    getIsActive
  )

  return data
}

export default useIsActive
