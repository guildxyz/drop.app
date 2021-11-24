import { Provider } from "@ethersproject/providers"
import { getDropCenterContract } from "contracts"

const contractOfDrop = (
  chainId: number,
  urlName: string,
  provider?: Provider
): Promise<string> =>
  getDropCenterContract(chainId, provider).contractOfDrop(urlName)

export default contractOfDrop
