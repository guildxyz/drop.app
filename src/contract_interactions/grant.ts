import { JsonRpcSigner, TransactionReceipt } from "@ethersproject/providers"
import TransactionError from "utils/errors/TransactionError"
import {
  contractsByDeployer,
  grant as airdropGrant,
  numOfDeployedContracts,
} from "./airdrop"
import grantSignature from "./utils/signatures/grant"

const grant = async (
  chainId: number,
  account: string,
  signer: JsonRpcSigner,
  serverId: string,
  roleId: string,
  contractId: number,
  recieverAddress: string
): Promise<TransactionReceipt> => {
  const numberOfTokens = await numOfDeployedContracts(chainId, account)
  if (contractId >= numberOfTokens) throw new Error("Invalid token contract")

  const tokenAddress = await contractsByDeployer(chainId, account, contractId)

  const signature = await grantSignature(
    chainId,
    serverId,
    account,
    roleId,
    tokenAddress,
    recieverAddress
  )

  try {
    const tx = await airdropGrant(
      chainId,
      signer,
      signature,
      serverId,
      roleId,
      recieverAddress,
      contractId
    )
    const receipt = await tx.wait()
    return receipt
  } catch {
    throw new TransactionError("Failed to grant token.")
  }
}

export default grant
