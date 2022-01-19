import { Provider, Web3Provider } from "@ethersproject/providers"
import { formatEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import getDropBalance from "contract_interactions/ERC20Drop/getDropBalance"
import useSWR from "swr"

const fetchContractBalance = (
  _: string,
  chainId: number,
  urlName: string,
  provider: Provider
) => getDropBalance(chainId, urlName, provider).then((_) => formatEther(_))

const useDropBalance = () => {
  const { chainId, library } = useWeb3React<Web3Provider>()
  const { dropContractType, urlName } = useDrop()
  const shouldFetch = dropContractType === "ERC20" && urlName?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["contractBalance", chainId, urlName, library] : null,
    fetchContractBalance
  )

  return data
}

export default useDropBalance
