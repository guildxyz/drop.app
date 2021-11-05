import { useWeb3React } from "@web3-react/core"
import getSymbol from "contract_interactions/roletoken/getSymbol"
import useSWR from "swr"

const fetchSymbol = (_: "tokenSymbol", chainId: number, tokenAddress: string) =>
  getSymbol(chainId, tokenAddress)

const useTokenSymbol = (address: string): string => {
  const { chainId } = useWeb3React()

  const shouldFetch = address?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["tokenSymbol", chainId, address] : null,
    fetchSymbol
  )

  return data
}
export default useTokenSymbol
