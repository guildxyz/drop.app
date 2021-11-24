import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"
import { Data } from "contract_interactions/types"

const startAirdropOnGroup = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  urlName: string,
  platform: string,
  dropName: string,
  groupId: string,
  data: Data,
  contractId: number,
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, provider)
    .connect(signer)
    .airdropOnGroup(
      signature,
      urlName,
      platform,
      dropName,
      groupId,
      data,
      contractId
    )

export default startAirdropOnGroup
