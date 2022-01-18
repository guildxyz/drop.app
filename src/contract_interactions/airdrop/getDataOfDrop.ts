import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"
import { Drop } from "contract_interactions/types"

const getDataOfDrop = (
  chainId: number,
  urlName: string,
  provider: Provider
): Promise<Drop> =>
  getAirdropContract(chainId, "NFT", provider)
    .dropsByUrl(urlName)
    .then(([dropName, platform, serverId, contractId]) => ({
      dropName,
      platform,
      serverId,
      contractId: +contractId,
      urlName,
    }))

export default getDataOfDrop
