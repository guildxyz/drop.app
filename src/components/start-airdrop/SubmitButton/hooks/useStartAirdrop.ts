import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import startAirdrop from "contract_interactions/startAirdrop"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"

export type StartAirdropData = {
  name: string
  platform: "DISCORD"
  urlName: string
  channel: string
  assetType: "NFT" | "TOKEN" | "ERC1155"
  serverId: string
  roles: Array<{
    roleId: string
    image: FileList
    traits: Array<{
      key: string
      value: string
    }>
    NFTName: string
  }>
  contractId: string
}

const useStartAirdrop = () => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const router = useRouter()
  const toast = useToast()

  const fetch = async (data: StartAirdropData) =>
    startAirdrop(
      chainId,
      account,
      library.getSigner(account),
      { ...data, platform: "DISCORD" },
      library
    )

  const onSuccess = (urlName: string) => {
    toast({
      status: "success",
      title: "Airdrop started",
      description: "You will soon be redirected to the created drop's page",
    })
    router.push(`/${urlName}`)
  }

  const onError = (error) => {
    console.log(error)
    toast({
      status: "error",
      title: "Start failed",
      description:
        "Failed to start airdrop, please double check your gas prices and try again",
    })
  }

  return useSubmit<StartAirdropData, string>(fetch, { onSuccess, onError })
}

export default useStartAirdrop
