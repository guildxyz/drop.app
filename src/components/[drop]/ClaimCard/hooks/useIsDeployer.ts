import { useDrop } from "components/[drop]/DropProvider"
import useContractByDeployer from "./useContractByDeployer"

const useIsDeployer = (): boolean => {
  const { tokenAddress } = useDrop()
  const contractAddress = useContractByDeployer()

  if (contractAddress === undefined) return undefined

  return contractAddress === tokenAddress
}

export default useIsDeployer
