import { useDrop } from "components/[drop]/DropProvider"
import useDeployedTokens from "hooks/useDeployedTokens"

const useContractId = (): number => {
  const { tokenAddress } = useDrop()
  const deployedTokens = useDeployedTokens()

  if (deployedTokens === undefined) return undefined

  return deployedTokens
    .map((deployedToken, index) => ({ deployedToken, index }))
    .find(({ deployedToken }) => deployedToken === tokenAddress)?.index
}

export default useContractId
