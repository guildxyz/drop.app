import {
  JsonRpcSigner,
  Provider,
  TransactionReceipt,
} from "@ethersproject/providers"
import TransactionError from "utils/errors/TransactionError"
import {
  contractsByDeployer,
  numOfDeployedContracts,
  stopAirdrop as airdropStopAirdrop,
} from "./airdrop"
import stopAirdropSignature from "./utils/signatures/stopAirdrop"

const stopAirdrop = async (
  chainId: number,
  account: string,
  signer: JsonRpcSigner,
  serverId: string,
  urlName: string,
  roleId: string,
  contractId: number,
  provider?: Provider
): Promise<TransactionReceipt> => {
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
    const receipt = await tx.wait()
    return receipt
  } catch {
    throw new TransactionError("Failed to stop airdrop.")
  }
}

export default stopAirdrop
