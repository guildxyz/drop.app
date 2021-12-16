import { Provider } from "@ethersproject/providers"
import { aggregate } from "@makerdao/multicall"
import { Chains } from "connectors"
import { AirdropAddresses, multicallConfigs } from "contracts"
import { RoleData } from "contract_interactions/types"

const getMetadataMulticall = async (
  chainId: number,
  platform: string,
  roleIds: string[],
  tokenAddress: string,
  provider?: Provider
): Promise<RoleData[]> => {
  const requests = roleIds.map((roleId, index) => ({
    target: AirdropAddresses[Chains[chainId]],
    call: [
      "metadata(string,string,address)(string)",
      platform,
      roleId,
      tokenAddress,
    ],
    returns: [[roleId]],
  }))

  const {
    results: { original },
  } = await aggregate(requests, multicallConfigs[Chains[chainId]])

  const metadatas = await Promise.all(
    Object.values(original).map((metadataHash) =>
      fetch(`https://ipfs.fleek.co/ipfs/${metadataHash}`).then((response) =>
        response.ok ? response.json() : undefined
      )
    )
  )

  return metadatas
}

export default getMetadataMulticall
