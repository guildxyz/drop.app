import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import ERC20_ABI from "static/abis/erc20abi.json"
import useSWR from "swr"
import type { Token } from "types"

const getBalance = async (
  _: string,
  address: string,
  tokenContract: Contract,
  decimals: number
): Promise<number> =>
  tokenContract &&
  tokenContract.balanceOf(address).then((balance) => +formatUnits(balance, decimals))

const useBalance = (token: Token): number => {
  const { library, chainId, account } = useWeb3React<Web3Provider>()
  const tokenContract = useContract(token?.address, ERC20_ABI)

  const shouldFetch = account && library && token?.address

  const { data } = useSWR(
    shouldFetch
      ? [`${token?.name}_balance`, account, tokenContract, token.decimals, chainId]
      : null,
    getBalance,
    {
      refreshInterval: 10_000,
      revalidateOnFocus: false,
      revalidateOnMount: false,
    }
  )

  return data
}

export default useBalance
