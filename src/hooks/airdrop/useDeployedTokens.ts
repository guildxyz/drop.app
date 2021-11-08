import { useWeb3React } from "@web3-react/core"
import deployedTokens from "contract_interactions/deployedTokens"
import useSWR from "swr"

const getDeployedTokens = (_: string, chainId: number, address: string) =>
  deployedTokens(chainId, address)

const useDeployedTokens = (): string[] => {
  const { account, chainId } = useWeb3React()
  const shouldFetch = account?.length > 0
  const { data } = useSWR(
    shouldFetch ? ["deployedTokens", chainId, account] : null,
    getDeployedTokens,
    { revalidateIfStale: true }
  )

  return data
}

export default useDeployedTokens
