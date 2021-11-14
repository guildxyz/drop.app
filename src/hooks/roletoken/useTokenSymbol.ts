import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import getSymbol from "contract_interactions/roletoken/getSymbol"
import useSWR from "swr"

const fetchSymbol = (
  _: "tokenSymbol",
  chainId: number,
  tokenAddress: string,
  provider: Provider
) => getSymbol(chainId, tokenAddress, provider)

const useTokenSymbol = (address: string): string => {
  const { chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch = address?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["tokenSymbol", chainId, address, library] : null,
    fetchSymbol
  )

  return data
}
export default useTokenSymbol
