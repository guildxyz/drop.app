import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import startAirdrop from "contract_interactions/startAirdrop"
import startTokenAirdrop from "contract_interactions/startTokenAirdrop"
import { Platform } from "contract_interactions/types"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useCallback, useMemo } from "react"
import { useWatch } from "react-hook-form"

export type NftField = {
  file: File
  traits: Array<{
    key: string
    value: string
  }>
  name: string
  roles: string[]
  hash: string
  progress: number
  preview: string
}

// TODO update this type
export type StartAirdropData = {
  urlName: string
  channel: string
  assetType: "NFT" | "TOKEN"
  assetData: {
    NFT: {
      name: string
      symbol: string
      description: string
    }
    TOKEN: {
      name: string
      symbol: string
      initialBalance: number
    }
  }
  inviteLink: string
  serverId: string
  nfts: NftField[]
  platform: Platform
  tokenRewards: {
    DISCORD: Record<string, number>
    TELEGRAM: number
  }
}

const useStartAirdrop = () => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const router = useRouter()
  const toast = useToast()
  const assetType = useWatch({ name: "assetType" })

  const airdropStarter = useMemo(() => {
    if (assetType === "NFT") return startAirdrop
    if (assetType === "TOKEN") return startTokenAirdrop
    return null
  }, [assetType])

  const fetch = useCallback(
    (data: StartAirdropData) => {
      console.log(data)

      return airdropStarter?.(
        chainId,
        account,
        library.getSigner(account),
        data,
        library
      )
    },
    [chainId, account, library, airdropStarter]
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
        error.message ||
        "Failed to start airdrop, please double check your gas prices and try again",
    })
  }

  return useSubmit<StartAirdropData, string>(fetch, { onSuccess, onError })
}

export default useStartAirdrop
