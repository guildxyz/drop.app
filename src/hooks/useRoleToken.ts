import useContract from "hooks/useContract"
import { useCallback } from "react"
import ROLE_TOKEN_ABI from "static/abis/roletoken.json"
import { RoleData } from "./useRoleData"

type RoleTokenMethods = {
  getDataOfRole: (serverId: string, roleId: string) => Promise<RoleData>
  getName: () => Promise<string>
  getSymbol: () => Promise<string>
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

  const getName = useCallback(() => contract.name(), [contract])
  const getSymbol = useCallback(() => contract.symbol(), [contract])

  return { getDataOfRole, getName, getSymbol }
}

export default useRoleToken
