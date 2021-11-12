import { TransactionReceipt } from "@ethersproject/abstract-provider"
import { JsonRpcSigner } from "@ethersproject/providers"
import { claim as airdropClaim } from "./airdrop"
import hashId from "./utils/hashId"
import claimSignature from "./utils/signatures/claim"

const claim = async (
  chainId: number,
  account: string,
  signer: JsonRpcSigner,
  roleId: string,
  serverId: string,
  tokenAddress: string,
  userId: string
): Promise<TransactionReceipt> => {
  try {
    const userIdHash = await hashId(userId, account)

    const signature = await claimSignature(
      chainId,
      roleId,
      serverId,
      account,
      tokenAddress,
      userIdHash
    )

    const tx = await airdropClaim(
      chainId,
      signer,
      signature,
      serverId,
      roleId,
      tokenAddress,
      userIdHash
    )
    const receipt = await tx.wait()
    return receipt
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default claim
