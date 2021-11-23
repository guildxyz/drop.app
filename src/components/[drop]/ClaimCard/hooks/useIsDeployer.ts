import useDeployedTokens from "hooks/useDeployedTokens"

const useIsDeployer = (tokenAddress: string): boolean => {
  const deployedToken = useDeployedTokens()
  return deployedToken?.includes(tokenAddress)
}

export default useIsDeployer
