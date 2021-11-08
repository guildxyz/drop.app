import { useWeb3React } from "@web3-react/core"
import contractsByDeployer from "contract_interactions/airdrop/contractsByDeployer"
import useSWR from "swr"

const getContractsByDeployer = (
  _: string,
  chainId: number,
  address: string,
  id: number
) => contractsByDeployer(chainId, address, id)

const useRoleTokenAddress = (contractId: number): string => {
  const { account, chainId } = useWeb3React()

  const shouldFetch = !!account && !!contractsByDeployer

  const { data } = useSWR(
    shouldFetch ? ["roleTokenAddress", chainId, account, contractId] : null,
    getContractsByDeployer
  )

  return data
}

export default useRoleTokenAddress
