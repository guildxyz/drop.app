import { Provider } from "@ethersproject/providers"
import { getERC20AirdropContract } from "contracts"
import { ERC20Drop } from "contract_interactions/types"

const getDataOfDrop = (
  chainId: number,
  urlName: string,
  provider?: Provider
): Promise<ERC20Drop> =>
  getERC20AirdropContract(chainId, provider)
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
