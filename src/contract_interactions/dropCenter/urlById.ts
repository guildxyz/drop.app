import { Provider } from "@ethersproject/providers"
import { getDropCenterContract } from "contracts"

const urlById = (
  chainId: number,
  id: number,
  provider?: Provider
): Promise<string> => getDropCenterContract(chainId, provider).urlById(id)

export default urlById
