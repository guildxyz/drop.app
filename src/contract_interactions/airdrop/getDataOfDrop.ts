import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"
import { Drop } from "contract_interactions/types"

const getDataOfDrop = (
  chainId: number,
  urlName: string,
  provider?: Provider
): Promise<Drop> =>
  getAirdropContract(chainId, provider)
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
