import { Chains } from "connectors"
import { tokenContractGetters } from "contracts"

type TokenAttribute = {
  trait_type: string
  value: string
}

export type TokenURI = {
  name: string
  description: string
  image: string
  external_url: string
  attributes: TokenAttribute[]
}

const getTokenURI = async (
  chainId: number,
  tokenAddress: string,
  tokenId: number
): Promise<TokenURI> => {
  const uri = await tokenContractGetters[Chains[chainId]](tokenAddress).tokenURI(
    tokenId
  )
  const header = "data:application/json;base64,"
  const data = uri.substring(header.length, uri.length)
  const buffer = Buffer.from(data, "base64")
  const tokenURI = JSON.parse(buffer.toString())
  return tokenURI
}

export default getTokenURI
