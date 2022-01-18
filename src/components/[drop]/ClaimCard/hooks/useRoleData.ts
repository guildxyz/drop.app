import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import { getAirdropContract } from "contracts"
import metadata from "contract_interactions/metadata"
import { RoleData } from "contract_interactions/types"
import useSWR from "swr"

const getRoleData = (
  _: "roleData",
  chainId: number,
  tokenAddress: string,
  platform: string,
  roleId: string,
  provider: Provider,
  dropContractType: string
) =>
  metadata(
    platform,
    roleId,
    tokenAddress,
    getAirdropContract(chainId, dropContractType, provider)
  )

const useRoleData = (roleId: string, fallbackData?: RoleData): RoleData => {
  const { chainId, library } = useWeb3React<Web3Provider>()
  const { tokenAddress, platform, dropContractType } = useDrop()

  const shouldFetch =
    platform?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? [
          "roleData",
          chainId,
          tokenAddress,
          platform,
          roleId,
          library,
          dropContractType,
        ]
      : null,
    getRoleData,
    { fallbackData }
  )

  return data
}

export default useRoleData
