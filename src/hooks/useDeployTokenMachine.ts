import { useWeb3React } from "@web3-react/core"
import { useFormContext } from "react-hook-form"
import { mutate } from "swr"
import useAirdrop from "./useAirdrop"
import useFetchMachine from "./useFetchMachine"

type DeployToken = {
  name: string
  symbol: string
}

const useDeployTokenMachine = () => {
  const { account } = useWeb3React()
  const { deployTokenContract } = useAirdrop()
  const { setValue } = useFormContext()

  return useFetchMachine<DeployToken>(async (_context, { data }) => {
    const { contractId } = await deployTokenContract(data.name, data.symbol)
    await mutate(["deployedTokens", account])
    setValue("contractId", contractId.toString())
  })
}

export default useDeployTokenMachine
