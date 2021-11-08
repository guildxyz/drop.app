import { JsonRpcSigner } from "@ethersproject/providers"
import {
  contractsByDeployer,
  deployTokenContract as airdropDeployTokenContract,
  numOfDeployedContracts,
} from "./airdrop"

type DeployedToken = {
  contractId: number
  tokenAddress: string
}

const deployTokenContract = async (
  chainId: number,
  account: string,
  signer: JsonRpcSigner,
  tokenName: string,
  tokenSymbol: string
): Promise<DeployedToken> => {
  const tx = await airdropDeployTokenContract(
    chainId,
    signer,
    tokenName,
    tokenSymbol
  )
  await tx.wait()
  const numOfContracts = await numOfDeployedContracts(chainId, account)
  const contractId = +numOfContracts - 1
  const tokenAddress = await contractsByDeployer(chainId, account, contractId)

  return {
    contractId,
    tokenAddress,
  }
}

export default deployTokenContract
