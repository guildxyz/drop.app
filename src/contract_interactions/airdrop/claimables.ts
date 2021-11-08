import { Chains } from "connectors"
import airdropContracts from "contracts"
import TransactionError from "utils/errors/TransactionError"

const claimables = (
  chainId: number,
  serverId: string,
  roleId: string,
  tokenAddress: string
): Promise<{ active: boolean; dropped: boolean }> =>
  airdropContracts[Chains[chainId]]
    .claimables(serverId, roleId, tokenAddress)
    .then(([active, dropped]) => ({ active, dropped }))
    .catch(() => {
      throw new TransactionError("Failed to read claimable NFTs")
    })

export default claimables
