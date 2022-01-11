import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import metadata from "contract_interactions/metadata"
import { Platform, RoleData } from "contract_interactions/types"
import getActiveRoles from "contract_interactions/utils/getActiveRoles"
import useSWR from "swr"

const fetchRolesData = async (
  _: string,
  chainId: number,
  urlName: string,
  serverId: string,
  tokenAddress: string,
  provider: Provider,
  platform: Platform
) => {
  const activeRoles = await getActiveRoles(
    chainId,
    urlName,
    serverId,
    tokenAddress,
    provider
  )
  const metadatas = await Promise.all(
    activeRoles.map((roleId) =>
      metadata(chainId, platform, roleId, tokenAddress, provider)
    )
  )

  return Object.fromEntries(
    activeRoles.map((roleId, index) => [roleId, metadatas[index]])
  )
}

const useRolesData = (
  serverId: string,
  tokenAddress: string,
  platform: Platform,
  urlName: string,
  fallbackData: Record<string, RoleData>
) => {
  const { chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch =
    serverId?.length > 0 &&
    tokenAddress?.length > 0 &&
    platform === "DISCORD" &&
    urlName?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["roleData", chainId, urlName, serverId, tokenAddress, library, platform]
      : null,
    fetchRolesData,
    { fallbackData, revalidateOnMount: true }
  )

  return data
}

export default useRolesData
