import { Chains } from "connectors"
import { tokenContractGetters } from "contracts"
import { RoleData } from "contract_interactions/types"

const getDataOfRole = (
  chainId: number,
  tokenAddress: string,
  serverId: string,
  roleId: string
): Promise<RoleData> =>
  tokenContractGetters[Chains[chainId]](tokenAddress)
    .getDataOfRole(serverId, roleId)
    .then(([imageHash, tokenName, traits]) => ({
      imageHash,
      tokenName,
      traits,
    }))

export default getDataOfRole
