import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import deployTokenContract from "contract_interactions/deployTokenContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useFormContext } from "react-hook-form"
import { mutate } from "swr"

type DeployToken = {
  NFT: {
    name: string
    symbol: string
  }
}

const useDeployToken = () => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const { setValue } = useFormContext()
  const toast = useToast()

  const fetch = async (data: DeployToken) => {
    const contractId = await deployTokenContract(
      chainId,
      account,
      library.getSigner(account),
      data.NFT.name,
      data.NFT.symbol,
      library
    )
    return contractId
  }

  const onSuccess = async (contractId: number) => {
    toast({
      status: "success",
      title: "Token deployed",
      description: "You can now start a new airdrop with this token!",
    })
    await mutate(["deployedTokens", chainId, account, library])
    setValue("contractId", contractId.toString())
  }

  const onError = () =>
    toast({
      status: "error",
      title: "Deploy Failed",
      description:
        "Failed to deploy token, please double check your gas prices and try again",
    })

  return useSubmit<DeployToken, number>(fetch, { onSuccess, onError })
}

export default useDeployToken
