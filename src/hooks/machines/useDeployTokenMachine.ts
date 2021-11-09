import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import deployTokenContract from "contract_interactions/deployTokenContract"
import { useFormContext } from "react-hook-form"
import { mutate } from "swr"
import useFetchMachine, { FetchMachine } from "./useFetchMachine"

type DeployToken = {
  NFT: {
    name: string
    symbol: string
  }
}

const useDeployTokenMachine = (): FetchMachine<DeployToken> => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const { setValue } = useFormContext()

  return useFetchMachine<DeployToken>(
    "Token deployed",
    async (_context, { data }) => {
      const { contractId } = await deployTokenContract(
        chainId,
        account,
        library.getSigner(account).connectUnchecked(),
        data.NFT.name,
        data.NFT.symbol
      )
      await mutate(["deployedTokens", chainId, account])
      setValue("contractId", contractId.toString())
    }
  )
}

export default useDeployTokenMachine
