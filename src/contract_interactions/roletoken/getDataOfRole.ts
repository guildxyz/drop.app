import { Provider } from "@ethersproject/providers"
import { getTokenContract } from "contracts"
import { RoleData } from "contract_interactions/types"

const getDataOfRole = (
  chainId: number,
  tokenAddress: string,
  serverId: string,
  roleId: string,
  provider?: Provider
): Promise<RoleData> =>
  getTokenContract(chainId, tokenAddress, provider)
    .getDataOfRole(serverId, roleId)
    .then(([imageHash, tokenName, traits]) => ({
      imageHash,
      tokenName,
      traits,
    }))

export default getDataOfRole
