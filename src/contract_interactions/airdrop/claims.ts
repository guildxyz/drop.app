import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"
import TransactionError from "utils/errors/TransactionError"

const claims = (
  chainId: number,
  address: string,
  serverId: string,
  roleId: string,
  tokenAddress: string,
  provider?: Provider
): Promise<{ claimed: boolean; approved: boolean }> =>
  getAirdropContract(chainId, provider)
    .claims(address, serverId, roleId, tokenAddress)
    .then(([claimed, approved]) => ({ claimed, approved }))
    .catch(() => {
      throw new TransactionError("Failed to read claimed NFTs")
    })

export default claims
