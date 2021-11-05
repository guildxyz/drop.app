import { useWeb3React } from "@web3-react/core"
import getName from "contract_interactions/roletoken/getName"
import useSWR from "swr"

const fetchName = (_: "tokenName", chainId: number, tokenAddress: string) =>
  getName(chainId, tokenAddress)

const useTokenName = (address: string): string => {
  const { chainId } = useWeb3React()

  const shouldFetch = address?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["tokenName", chainId, address] : null,
    fetchName
  )

  return data
}
export default useTokenName
