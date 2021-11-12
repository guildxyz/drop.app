import { Chains } from "connectors"
import airdropContracts from "contracts"
import hashId from "contract_interactions/utils/hashId"
import TransactionError from "utils/errors/TransactionError"

const claims = (
  chainId: number,
  address: string,
  userId: string,
  serverId: string,
  roleId: string,
  tokenAddress: string
): Promise<boolean> =>
  hashId(userId, address).then((userIdHash) =>
    airdropContracts[Chains[chainId]]
      .claims(userIdHash, serverId, roleId, tokenAddress)
      .catch(() => {
        throw new TransactionError("Failed to read claimed NFTs")
      })
  )

export default claims
