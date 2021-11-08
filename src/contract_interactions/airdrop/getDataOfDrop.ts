import { Chains } from "connectors"
import airdropContracts from "contracts"
import { Drop } from "contract_interactions/types"

const getDataOfDrop = (chainId: number, name: string): Promise<Drop> =>
  airdropContracts[Chains[chainId]]
    .getDataOfDrop(name)
    .then(([serverId, roleIds, tokenAddress]) => ({
      serverId,
      roleIds,
      tokenAddress,
      name,
    }))

export default getDataOfDrop
