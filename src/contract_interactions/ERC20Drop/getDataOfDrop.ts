import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"
import { Drop } from "contract_interactions/types"

const getDataOfDrop = (
  chainId: number,
  urlName: string,
  provider?: Provider
): Promise<Drop> =>
  getAirdropContract(chainId, "ERC20", provider)
    .dropsByUrl(urlName)
    .then(([dropName, platform, serverId, tokenAddress, ownerAddress]) => ({
      dropName,
      platform,
      serverId,
      tokenAddress,
      ownerAddress,
      urlName,
    }))

export default getDataOfDrop
