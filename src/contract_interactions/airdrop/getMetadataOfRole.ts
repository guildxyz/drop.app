import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const getMetadataOfRole = (
  chainId: number,
  platform: string,
  roleId: string,
  tokenAddress: string,
  provider?: Provider
): Promise<string> =>
  getAirdropContract(chainId, provider).metadata(platform, roleId, tokenAddress)

export default getMetadataOfRole
