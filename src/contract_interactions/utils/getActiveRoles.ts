import { Provider } from "@ethersproject/providers"
import { fetchRoles } from "components/start-airdrop/UploadNFTs/hooks/useRoles"
import isActive from "contract_interactions/airdrop/isActive"

const getActiveRoles = async (
  chainId: number,
  urlName: string,
  serverId: string,
  tokenAddress: string,
  provider?: Provider
): Promise<string[]> => {
  const roleIds = await fetchRoles("", serverId)
    .then((roles) => Object.keys(roles))
    .catch(() => [])

  // TDOO: Multicall?
  /* const requests = roleIds.map((roleId, index) => ({
    target: AirdropAddresses[Chains[chainId]],
    call: ["active(string,string,address)(bool)", urlName, roleId, tokenAddress],
    returns: [[roleId]],
  }))

  const {
    results: { original },
  } = await aggregate(requests, multicallConfigs[Chains[chainId]]) */

  const actives = await Promise.all(
    roleIds.map((roleId) =>
      isActive(chainId, urlName, roleId, tokenAddress, provider)
    )
  )

  return roleIds.filter((_, index) => !!actives[index])
}

export default getActiveRoles
