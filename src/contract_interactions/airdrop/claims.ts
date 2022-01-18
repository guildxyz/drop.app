import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const claims = (
  chainId: number,
  userId: string,
  platform: string,
  roleId: string,
  tokenAddress: string,
  provider?: Provider
): Promise<boolean> =>
  getAirdropContract(chainId, "NFT", provider)
    .claims(userId, platform, roleId, tokenAddress)
    .catch(() => {
      throw new Error("Failed to read claimed NFTs")
    })

export default claims
