import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const claims = (
  chainId: number,
  address: string,
  platform: string,
  roleId: string,
  tokenAddress: string,
  provider?: Provider
): Promise<{ claimed: boolean; approved: boolean }> =>
  getAirdropContract(chainId, provider)
    .claims(address, platform, roleId, tokenAddress)
    .then(([claimed, approved]) => ({ claimed, approved }))
    .catch(() => {
      throw new Error("Failed to read claimed NFTs")
    })

export default claims
