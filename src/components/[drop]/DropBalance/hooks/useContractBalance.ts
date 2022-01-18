import { BigNumber } from "@ethersproject/bignumber"
import { Provider, Web3Provider } from "@ethersproject/providers"
import { formatEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import { getERC20Contract } from "contracts"
import useSWR from "swr"

const fetchContractBalance = (
  _: string,
  chainId: number,
  tokenAddress: string,
  provider: Provider
) =>
  getERC20Contract(chainId, tokenAddress, provider)
    .totalSupply()
    .then((_: BigNumber) => +formatEther(_))

const useContractBalance = () => {
  const { chainId, library } = useWeb3React<Web3Provider>()
  const { tokenAddress, dropContractType } = useDrop()
  const shouldFetch = dropContractType === "ERC20" && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["contractBalance", chainId, tokenAddress, library] : null,
    fetchContractBalance
  )

  return data
}

export default useContractBalance
