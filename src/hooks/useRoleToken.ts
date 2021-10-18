import useContract from "hooks/useContract"
import { useCallback } from "react"
import ROLE_TOKEN_ABI from "static/abis/roletoken.json"
import { RoleData } from "./useRoleData"

type RoleTokenMethods = {
  getDataOfRole: (serverId: string, roleId: string) => Promise<RoleData>
}

const useRoleToken = (tokenAddress: string): RoleTokenMethods => {
  // Afaik we won't need to call write methods
  const contract = useContract(tokenAddress, ROLE_TOKEN_ABI)

  const getDataOfRole = useCallback(
    (serverId: string, roleId: string) =>
      contract
        .getDataOfRole(serverId, roleId)
        .then(([imageHash, dropName, traits]) => ({ imageHash, dropName, traits })),
    [contract]
  )

  return { getDataOfRole }
}

export default useRoleToken
