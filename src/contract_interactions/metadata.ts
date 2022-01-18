import { Provider } from "@ethersproject/providers"
import getMetadataOfRole from "./airdrop/getMetadataOfRole"
import { RoleData } from "./types"

const metadata = (
  chainId: number,
  platform: string,
  roleId: string,
  tokenAddress: string,
  provider: Provider
): Promise<RoleData> =>
  getMetadataOfRole(chainId, platform, roleId, tokenAddress, provider).then(
    (metadataHash) =>
      metadataHash === ""
        ? null
        : fetch(`https://ipfs.fleek.co/ipfs/${metadataHash}`).then((response) =>
            response.ok
              ? response.json()
              : Promise.reject(new Error("Request for meta data hash failed"))
          )
  )

export default metadata
