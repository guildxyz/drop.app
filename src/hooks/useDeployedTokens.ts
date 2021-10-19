import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import useAirdrop from "./useAirdrop"

const getDeployesTokens = (
  _: string,
  address: string,
  deployedTokens: (address: string) => Promise<string[]>
) => deployedTokens(address)

const useDeployedTokens = () => {
  const { deployedTokens } = useAirdrop()
  const { account } = useWeb3React()
  const shouldFetch = account?.length > 0
  const { data } = useSWR(
    shouldFetch ? ["deployedTokens", account, deployedTokens] : null,
    getDeployesTokens
  )
  return data
}

export default useDeployedTokens
