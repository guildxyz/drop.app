import { TransactionReceipt } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { ClaimData } from "components/[drop]/ClaimCard/hooks/useClaim"
import { claim as airdropClaim } from "./airdrop"
import claimSignature from "./utils/signatures/claim"

const claim = async (
  chainId: number,
  address: string,
  signer: JsonRpcSigner,
  { roleId, serverId, tokenAddress, platform, userId }: ClaimData,
  provider?: Provider
): Promise<TransactionReceipt> => {
  const signature = await claimSignature(
    chainId,
    serverId,
    platform,
    address,
    userId,
    roleId,
    tokenAddress
  )

  try {
    const tx = await airdropClaim(
      chainId,
      signer,
      signature,
      platform,
      roleId,
      userId,
      tokenAddress,
      provider
    )
    const receipt = await tx.wait()
    return receipt
  } catch (error) {
    console.error(error)
    throw new Error("Failed to claim NFT.")
  }
}

export default claim
