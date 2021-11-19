import type { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import deployedTokens from "contract_interactions/deployedTokens"
import useSWR from "swr"

const getDeployedTokens = (
  _: string,
  chainId: number,
  address: string,
  provider: Provider
) => deployedTokens(chainId, address, provider)

const useDeployedTokens = (): string[] => {
  const { account, chainId, library } = useWeb3React<Web3Provider>()
  const shouldFetch = account?.length > 0 && typeof chainId === "number" && !!library
  const { data } = useSWR(
    shouldFetch ? ["deployedTokens", chainId, account, library] : null,
    getDeployedTokens
  )

  return data
}

export default useDeployedTokens
