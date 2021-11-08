import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner } from "@ethersproject/providers"
import { Chains } from "connectors"
import airdropContracts from "contracts"

const deployTokenContract = async (
  chainId: number,
  signer: JsonRpcSigner,
  tokenName: string,
  tokenSymbol: string
): Promise<TransactionResponse> =>
  airdropContracts[Chains[chainId]]
    .connect(signer)
    .deployTokenContract(tokenName, tokenSymbol)

export default deployTokenContract
