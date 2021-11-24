import { Provider } from "@ethersproject/providers"
import { getTokenContract } from "contracts"
import { RoleData } from "contract_interactions/types"

const getDataOfRole = (
  chainId: number,
  tokenAddress: string,
  platform: string,
  roleId: string,
  provider?: Provider
): Promise<RoleData> =>
  getTokenContract(chainId, tokenAddress, provider)
    .getDataOfRole(platform, roleId)
    .then(([imageHash, tokenName, traits, values]) => ({
      imageHash,
      tokenName,
      traits,
      values,
    }))

export default getDataOfRole
