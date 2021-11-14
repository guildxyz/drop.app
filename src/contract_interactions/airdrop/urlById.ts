import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const urlById = (
  chainId: number,
  id: number,
  provider?: Provider
): Promise<string> => getAirdropContract(chainId, provider).urlById(id)

export default urlById
