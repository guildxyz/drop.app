import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import useAirdrop from "./useAirdrop"

const useRoleTokenAddress = (contractId: number): string => {
  const { contractsByDeployer } = useAirdrop()
  const { account } = useWeb3React()

  const shouldFetch = !!account && !!contractsByDeployer

  const { data } = useSWR(
    shouldFetch ? ["roleTokenAddress", account, contractId] : null,
    (_: string, address: string, id: number) => contractsByDeployer(address, id)
  )

  return data
}

export default useRoleTokenAddress
