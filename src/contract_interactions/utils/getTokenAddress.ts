import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const getTokenAddress = async (
  chainId: number,
  urlName: string,
  dropType: string,
  provider: Provider
): Promise<string> => {
  const contract = getAirdropContract(chainId, dropType, provider)
  const eventFilter = contract.filters.NewAirdrop(urlName)
  const [event] = await contract.queryFilter(eventFilter)
  return event.args.tokenAddress
}

export default getTokenAddress
