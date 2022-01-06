import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import isActive from "contract_interactions/airdrop/isActive"
import useSWR from "swr"

const getIsActive = async (
  _: string,
  chainId: number,
  urlName: string,
  roleId: string,
  tokenAddress: string,
  provider: Provider
) => isActive(chainId, urlName, roleId, tokenAddress, provider)

const useIsActive = (roleId: string): boolean => {
  const { urlName, tokenAddress } = useDrop()
  const { chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch =
    urlName?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["isActive", chainId, urlName, roleId, tokenAddress, library]
      : null,
    getIsActive
  )

  return data
}

export default useIsActive
