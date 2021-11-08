import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner } from "@ethersproject/providers"
import { Chains } from "connectors"
import airdropContracts from "contracts"

const stopAirdrop = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  urlName: string,
  roleId: string
): Promise<TransactionResponse> =>
  airdropContracts[Chains[chainId]]
    .connect(signer)
    .stopAirdrop(signature, urlName, roleId)

export default stopAirdrop
