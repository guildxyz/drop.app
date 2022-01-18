import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import getRewardOfRole from "contract_interactions/ERC20Drop/getRewardOfRole"
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
  dropContractType: string,
  urlName: string
) =>
  dropContractType === "NFT"
    ? metadata(chainId, platform, roleId, tokenAddress, provider)
    : getRewardOfRole(chainId, urlName, roleId, provider).then((_) => _.toString())

const useRoleData = (roleId: string, fallbackData?: RoleData): RoleData | string => {
  const { chainId, library } = useWeb3React<Web3Provider>()
  const { tokenAddress, platform, dropContractType, urlName } = useDrop()

  const shouldFetch =
    platform?.length > 0 && roleId?.length > 0 && tokenAddress?.length > 0

  const { data } = useSWR<RoleData | string>(
    shouldFetch
      ? [
          "roleData",
          chainId,
          tokenAddress,
          platform,
          roleId,
          library,
          dropContractType,
          urlName,
        ]
      : null,
    getRoleData,
    { fallbackData }
  )

  return data
}

export default useRoleData
