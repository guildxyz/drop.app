import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"
import hashId from "contract_interactions/utils/hashId"

const claims = (
  chainId: number,
  userId: string,
  address: string,
  platform: string,
  roleId: string,
  tokenAddress: string,
  provider?: Provider
): Promise<boolean> =>
  hashId(userId, address).then((hash) =>
    getAirdropContract(chainId, provider)
      .claims(hash, platform, roleId, tokenAddress)
      .catch(() => {
        throw new Error("Failed to read claimed NFTs")
      })
  )

export default claims
