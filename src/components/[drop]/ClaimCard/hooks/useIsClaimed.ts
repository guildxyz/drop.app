import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { claims } from "contract_interactions/airdrop"
import useSWR from "swr"

const getClaims = (
  _: string,
  chainId: number,
  address: string,
  serverId: string,
  roleId: string,
  tokenAddress: string,
  provider: Provider
) =>
  claims(chainId, address, serverId, roleId, tokenAddress, provider).then(
    ({ claimed }) => claimed
  )

const useIsClaimed = (
  serverId: string,
  roleId: string,
  tokenAddress: string
): boolean => {
  const { account, chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch =
    serverId?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["isClaimed", chainId, account, serverId, roleId, tokenAddress, library]
      : null,
    getClaims
  )

  return data
}

export default useIsClaimed
