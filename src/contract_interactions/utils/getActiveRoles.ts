import { Provider } from "@ethersproject/providers"
import { fetchRoles } from "components/start-airdrop/NFTSections/components/Uploaders/hooks/useRoles"
import isActive from "contract_interactions/airdrop/isActive"
import getRewardOfRole from "contract_interactions/ERC20Drop/getRewardOfRole"

const getActiveRoles = async (
  chainId: number,
  urlName: string,
  serverId: string,
  tokenAddress: string,
  dropType: string,
  provider: Provider
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
    dropType === "NFT"
      ? roleIds.map((roleId) =>
          isActive(chainId, urlName, roleId, tokenAddress, provider)
        )
      : roleIds.map((roleId) =>
          getRewardOfRole(chainId, urlName, roleId, provider).then(
            (reward) => reward > 0
          )
        )
  )

  return roleIds.filter((_, index) => !!actives[index])
}

export default getActiveRoles
