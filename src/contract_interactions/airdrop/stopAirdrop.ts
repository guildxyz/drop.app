import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const stopAirdrop = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  urlName: string,
  roleId: string,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, "NFT", provider)
    .connect(signer)
    .stopAirdrop(signature, urlName, roleId)

export default stopAirdrop
