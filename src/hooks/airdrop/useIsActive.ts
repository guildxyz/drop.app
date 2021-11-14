import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { claimables } from "contract_interactions/airdrop"
import useSWR from "swr"

const getIsActive = async (
  _: string,
  chainId: number,
  serverId: string,
  roleId: string,
  tokenAddress: string,
  provider: Provider
) =>
  claimables(chainId, serverId, roleId, tokenAddress, provider).then(
    ({ dropped }) => dropped
  )

const useIsActive = (
  serverId: string,
  roleId: string,
  tokenAddress: string
): boolean => {
  const { chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch =
    serverId?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["claimableRoles", chainId, serverId, roleId, tokenAddress, library]
      : null,
    getIsActive
  )

  return data
}

export default useIsActive
