import { TransactionReceipt } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { ClaimData } from "components/[drop]/ClaimCard/hooks/useClaim"
import { mutate } from "swr"
import tokenAirdropClaim from "./ERC20Drop/claim"
import claimTokenSignature from "./utils/signatures/claimToken"

const claimToken = async (
  chainId: number,
  address: string,
  signer: JsonRpcSigner,
  { roleId, serverId, urlName, userId, platform }: ClaimData,
  provider?: Provider
): Promise<TransactionReceipt> => {
  const signature = await claimTokenSignature(
    chainId,
    serverId,
    platform,
    address,
    userId,
    roleId,
    urlName
  )

  try {
    const tx = await tokenAirdropClaim(
      chainId,
      signer,
      signature,
      urlName,
      roleId,
      userId,
      provider
    )
    const receipt = await tx.wait()
    await mutate(["contractBalance", chainId, urlName, provider])
    return receipt
  } catch (error) {
    console.error(error)
    throw new Error("Failed to claim NFT.")
  }
}

export default claimToken
