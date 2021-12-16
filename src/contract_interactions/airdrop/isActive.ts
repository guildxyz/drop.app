import { Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const isActive = (
  chainId: number,
  urlName: string,
  roleId: string,
  tokenAddress: string,
  provider?: Provider
): Promise<boolean> =>
  getAirdropContract(chainId, provider)
    .active(urlName, roleId, tokenAddress)
    .catch(() => {
      throw new Error("Failed to read active NFTs")
    })

export default isActive
