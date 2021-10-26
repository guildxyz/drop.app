import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import useAirdrop from "./useAirdrop"

const useDeployedTokens = (): string[] => {
  const { deployedTokens } = useAirdrop()
  const { account } = useWeb3React()
  const shouldFetch = account?.length > 0
  const { data } = useSWR(
    shouldFetch ? ["deployedTokens", account] : null,
    (_: string, address: string) => deployedTokens(address),
    { revalidateIfStale: true }
  )

  return data
}

export default useDeployedTokens
