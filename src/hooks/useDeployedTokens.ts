import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import useAirdrop from "./useAirdrop"

const getDeployedTokens = (
  _: string,
  address: string,
  deployedTokens: (address: string) => Promise<string[]>
) => deployedTokens(address)

const useDeployedTokens = () => {
  const { deployedTokens: fetchDeployedTokens } = useAirdrop()
  const { account } = useWeb3React()
  const shouldFetch = account?.length > 0
  const { data: deployedTokens, mutate } = useSWR(
    shouldFetch ? ["deployedTokens", account] : null,
    (_: string, address: string) => fetchDeployedTokens(address),
    { revalidateIfStale: true }
  )
  return { deployedTokens, mutate }
}

export default useDeployedTokens
