import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import { getAirdropContract } from "contracts"
import isActive from "contract_interactions/airdrop/isActive"
import useSWR from "swr"

const getIsActive = async (
  _: string,
  chainId: number,
  urlName: string,
  roleId: string,
  tokenAddress: string,
  provider: Provider,
  dropContractType: string
) =>
  isActive(
    urlName,
    roleId,
    tokenAddress,
    getAirdropContract(chainId, dropContractType, provider)
  )

const useIsActive = (roleId: string): boolean => {
  const { urlName, tokenAddress, dropContractType } = useDrop()
  const { chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch =
    urlName?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? [
          "isActive",
          chainId,
          urlName,
          roleId,
          tokenAddress,
          library,
          dropContractType,
        ]
      : null,
    getIsActive
  )

  return data
}

export default useIsActive
