import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { StopAirdropData } from "components/[drop]/ClaimCard/components/StopAirdropButton/hooks/useStopAirdrop"
import {
  contractsByDeployer,
  numOfDeployedContracts,
  stopAirdrop as airdropStopAirdrop,
} from "./airdrop"
import stopAirdropSignature from "./utils/signatures/stopAirdrop"

export type StoppedAirdrop = {
  serverId: string
  roleId: string
  tokenAddress: string
}

const stopAirdrop = async (
  chainId: number,
  account: string,
  signer: JsonRpcSigner,
  { serverId, urlName, roleId, contractId, platform }: StopAirdropData,
  provider?: Provider
): Promise<StoppedAirdrop> => {
  const numberOfTokens = await numOfDeployedContracts(chainId, account, provider)
  if (contractId >= numberOfTokens) throw new Error("Invalid token contract")

  const tokenAddress = await contractsByDeployer(
    chainId,
    account,
    contractId,
    provider
  )

  const signature = await stopAirdropSignature(
    chainId,
    serverId,
    platform,
    account,
    roleId,
    tokenAddress
  )

  try {
    const tx = await airdropStopAirdrop(
      chainId,
      signer,
      signature,
      urlName,
      roleId,
      provider
    )
    await tx.wait()
    return {
      serverId,
      roleId,
      tokenAddress,
    }
  } catch {
    throw new Error("Failed to stop airdrop.")
  }
}

export default stopAirdrop
