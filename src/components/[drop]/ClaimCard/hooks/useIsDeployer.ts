import { useDrop } from "components/[drop]/DropProvider"
import useDeployedTokens from "hooks/useDeployedTokens"

const useIsDeployer = (): boolean => {
  const { tokenAddress } = useDrop()
  const deployedToken = useDeployedTokens()
  return deployedToken?.includes(tokenAddress)
}

export default useIsDeployer
