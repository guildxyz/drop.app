import useDeployedTokens from "hooks/useDeployedTokens"

const useContractId = (tokenAddress: string): number => {
  const deployedTokens = useDeployedTokens()

  if (deployedTokens === undefined) return undefined

  return deployedTokens
    .map((deployedToken, index) => ({ deployedToken, index }))
    .find(({ deployedToken }) => deployedToken === tokenAddress)?.index
}

export default useContractId
