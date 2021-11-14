import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import contractsByDeployer from "contract_interactions/airdrop/contractsByDeployer"
import useSWR from "swr"

const getContractsByDeployer = (
  _: string,
  chainId: number,
  address: string,
  id: number,
  provider: Provider
) => contractsByDeployer(chainId, address, id, provider)

const useRoleTokenAddress = (contractId: number): string => {
  const { account, chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch = !!account && !!contractsByDeployer

  const { data } = useSWR(
    shouldFetch ? ["roleTokenAddress", chainId, account, contractId, library] : null,
    getContractsByDeployer
  )

  return data
}

export default useRoleTokenAddress
