import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import claim from "contract_interactions/claim"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"

export type ClaimData = {
  serverId: string
  roleId: string
  tokenAddress: string
}

const useClaim = () => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const toast = useToast()

  const fetcher = async (data: ClaimData) =>
    claim(chainId, account, library.getSigner(account), data, library)

  const onSuccess = () =>
    toast({
      status: "success",
      title: "Claimed",
      description: "You successfully claimed the NFT for you role!",
    })

  const onError = () =>
    toast({
      status: "error",
      title: "Claim failed",
      description:
        "Failed to claim NFT, please try again, and double check gas prices",
    })

  return useSubmit(fetcher, { onSuccess, onError })
}

export default useClaim
