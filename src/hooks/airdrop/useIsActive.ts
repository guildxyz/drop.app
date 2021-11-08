import { useWeb3React } from "@web3-react/core"
import { claimables } from "contract_interactions/airdrop"
import useSWR from "swr"

const getIsActive = async (
  _: string,
  chainId: number,
  serverId: string,
  roleId: string,
  tokenAddress: string
) =>
  claimables(chainId, serverId, roleId, tokenAddress).then(({ dropped }) => dropped)

const useIsActive = (
  serverId: string,
  roleId: string,
  tokenAddress: string
): boolean => {
  const { chainId } = useWeb3React()

  const shouldFetch =
    serverId?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["claimableRoles", chainId, serverId, roleId, tokenAddress] : null,
    getIsActive
  )

  return data
}

export default useIsActive
