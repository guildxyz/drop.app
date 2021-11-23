import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import stopAirdrop, { StoppedAirdrop } from "contract_interactions/stopAirdrop"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { mutate } from "swr"

export type StopAirdropData = {
  roleId: string
  serverId: string
  contractId: number
  urlName: string
  platform: string
}

const useStopAirdrop = () => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const toast = useToast()

  const fetcher = async (data: StopAirdropData): Promise<StoppedAirdrop> =>
    stopAirdrop(chainId, account, library.getSigner(account), data, library)

  const onSuccess = ({ serverId, roleId, tokenAddress }: StoppedAirdrop) => {
    toast({
      status: "success",
      title: "Drop stopped",
      description: "You successfully stopped the drop for this role!",
    })
    mutate(["isActive", chainId, serverId, roleId, tokenAddress, library])
  }

  const onError = () =>
    toast({
      status: "error",
      title: "Stop failed",
      description:
        "Failed to stop airdrop for this role, please try again, and double check gas prices",
    })

  return useSubmit(fetcher, { onSuccess, onError })
}

export default useStopAirdrop
