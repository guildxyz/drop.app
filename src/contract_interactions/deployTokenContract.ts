import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import {
  deployTokenContract as airdropDeployTokenContract,
  numOfDeployedContracts,
} from "./airdrop"

const deployTokenContract = async (
  chainId: number,
  account: string,
  signer: JsonRpcSigner,
  tokenName: string,
  tokenSymbol: string,
  description: string,
  provider?: Provider
): Promise<number> => {
  const tx = await airdropDeployTokenContract(
    chainId,
    signer,
    tokenName,
    tokenSymbol,
    description,
    provider
  )
  await tx.wait()
  const numOfContracts = await numOfDeployedContracts(chainId, account, provider)

  return +numOfContracts - 1
}

export default deployTokenContract
