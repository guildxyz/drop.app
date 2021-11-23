import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { claimables } from "contract_interactions/airdrop"
import useSWR from "swr"

const getIsActive = async (
  _: string,
  chainId: number,
  platform: string,
  roleId: string,
  tokenAddress: string,
  provider: Provider
) =>
  claimables(chainId, platform, roleId, tokenAddress, provider).then(
    ({ dropped, active }) => ({ isDropped: dropped, isActive: active })
  )

const useIsActive = (
  platform: string,
  roleId: string,
  tokenAddress: string
): { isActive: boolean; isDropped: boolean } => {
  const { chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch =
    platform?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["isActive", chainId, platform, roleId, tokenAddress, library]
      : null,
    getIsActive
  )

  return data ?? { isActive: undefined, isDropped: undefined }
}

export default useIsActive
