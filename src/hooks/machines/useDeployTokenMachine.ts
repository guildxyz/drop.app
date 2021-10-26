import { useWeb3React } from "@web3-react/core"
import useAirdrop from "hooks/airdrop/useAirdrop"
import { useFormContext } from "react-hook-form"
import { mutate } from "swr"
import useFetchMachine, { FetchMachine } from "./useFetchMachine"

type DeployToken = {
  name: string
  symbol: string
}

const useDeployTokenMachine = (): FetchMachine<DeployToken> => {
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
