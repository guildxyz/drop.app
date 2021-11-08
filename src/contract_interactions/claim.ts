import { TransactionReceipt } from "@ethersproject/abstract-provider"
import { JsonRpcSigner } from "@ethersproject/providers"
import TransactionError from "utils/errors/TransactionError"
import { claim as airdropClaim } from "./airdrop"
import claimSignature from "./utils/signatures/claim"

const claim = async (
  chainId: number,
  account: string,
  signer: JsonRpcSigner,
  roleId: string,
  serverId: string,
  tokenAddress: string
): Promise<TransactionReceipt> => {
  const signature = await claimSignature(
    chainId,
    roleId,
    serverId,
    account,
    tokenAddress
  )

  try {
    const tx = await airdropClaim(
      chainId,
      signer,
      signature,
      serverId,
      roleId,
      tokenAddress
    )
    const receipt = await tx.wait()
    return receipt
  } catch (error) {
    console.error(error)
    throw new TransactionError("Failed to claim NFT.")
  }
}

export default claim
