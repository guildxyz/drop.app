import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import { contractsByDeployer } from "contract_interactions/airdrop"
import useSWR from "swr"

const fetchContractByDeployer = (
  _: string,
  chainId: number,
  account: string,
  contractId: number,
  library?: Provider
) => contractsByDeployer(chainId, account, contractId, library)

const useContractByDeployer = (): string => {
  const { account, chainId, library } = useWeb3React<Web3Provider>()
  const { contractId } = useDrop()

  const shouldFetch =
    typeof contractId === "number" &&
    account?.length >= 0 &&
    typeof chainId === "number" &&
    !!library

  const { data } = useSWR(
    shouldFetch
      ? ["contractByDeployer", chainId, account, contractId, library]
      : null,
    fetchContractByDeployer
  )

  return data
}

export { fetchContractByDeployer }
export default useContractByDeployer
