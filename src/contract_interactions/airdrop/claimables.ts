import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const claimables = (
  chainId: number,
  serverId: string,
  roleId: string,
  tokenAddress: string,
  provider?: Provider
): Promise<{ active: boolean; dropped: boolean }> =>
  getAirdropContract(chainId, provider)
    .claimables(serverId, roleId, tokenAddress)
    .then(([active, dropped]) => ({ active, dropped }))
    .catch(() => {
      throw new Error("Failed to read claimable NFTs")
    })

export default claimables
