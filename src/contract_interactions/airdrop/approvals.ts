import { Chains } from "connectors"
import airdropContracts from "contracts"
import TransactionError from "utils/errors/TransactionError"

const approvals = (
  chainId: number,
  address: string,
  serverId: string,
  roleId: string,
  tokenAddress: string
): Promise<{ claimed: boolean; approved: boolean }> =>
  airdropContracts[Chains[chainId]]
    .approvals(address, serverId, roleId, tokenAddress)
    .then(([claimed, approved]) => ({ claimed, approved }))
    .catch(() => {
      throw new TransactionError("Failed to read claimed NFTs")
    })

export default approvals
