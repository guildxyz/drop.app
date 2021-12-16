import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const getTokenAddress = async (
  chainId: number,
  urlName: string,
  provider?: Provider
): Promise<string> => {
  const tokenContract = getAirdropContract(chainId, provider)

  const eventFilter = tokenContract.filters.NewAirdrop(urlName)
  const [event] = await tokenContract.queryFilter(eventFilter)
  return event.args.tokenAddress
}

export default getTokenAddress
