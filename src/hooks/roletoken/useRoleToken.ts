import useContract from "hooks/useContract"
import { useCallback } from "react"
import ROLE_TOKEN_ABI from "static/abis/roletoken.json"
import { RoleData } from "./useRoleData"

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

type RoleTokenMethods = {
  getDataOfRole: (serverId: string, roleId: string) => Promise<RoleData>
  getName: () => Promise<string>
  getSymbol: () => Promise<string>
  tokenURI: (tokenId: number) => Promise<TokenURI>
}

const useRoleToken = (tokenAddress: string): RoleTokenMethods => {
  // Afaik we won't need to call write methods
  const contract = useContract(tokenAddress, ROLE_TOKEN_ABI)

  const getDataOfRole = useCallback(
    (serverId: string, roleId: string) =>
      contract
        .getDataOfRole(serverId, roleId)
        .then(([imageHash, tokenName, traits]) => ({
          imageHash,
          tokenName,
          traits,
        })),
    [contract]
  )

  const tokenURI = useCallback(
    async (tokenId: number) => {
      const uri = await contract.tokenURI(tokenId)
      const header = "data:application/json;base64,"
      const data = uri.substring(header.length, uri.length)
      const buffer = Buffer.from(data, "base64")
      const object = JSON.parse(buffer.toString())
      return object
    },
    [contract]
  )

  const getName = useCallback(() => contract.name(), [contract])
  const getSymbol = useCallback(() => contract.symbol(), [contract])

  return { getDataOfRole, getName, getSymbol, tokenURI }
}

export default useRoleToken
