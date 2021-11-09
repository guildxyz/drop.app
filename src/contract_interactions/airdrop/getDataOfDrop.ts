import { Chains } from "connectors"
import airdropContracts from "contracts"
import { Drop } from "contract_interactions/types"

const getDataOfDrop = (chainId: number, urlName: string): Promise<Drop> =>
  airdropContracts[Chains[chainId]]
    .getDataOfDrop(urlName)
    .then(
      ([dropName, serverId, roleIds, tokenAddress, contractId, numOfActive]) => ({
        dropName,
        serverId,
        roleIds,
        tokenAddress,
        contractId: +contractId,
        numOfActive: +numOfActive,
        urlName,
      })
    )

export default getDataOfDrop
