import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import getName from "contract_interactions/roletoken/getName"
import useSWR from "swr"

const fetchName = (
  _: "tokenName",
  chainId: number,
  tokenAddress: string,
  provider: Provider
) => getName(chainId, tokenAddress, provider)

const useTokenName = (address: string): string => {
  const { chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch = address?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["tokenName", chainId, address, library] : null,
    fetchName
  )

  return data
}
export default useTokenName
