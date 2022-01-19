import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import claim from "contract_interactions/claim"
import erc20Claim from "contract_interactions/claimToken"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useUserId from "hooks/useUserId"
import { useMemo } from "react"

export type ClaimData = {
  serverId: string
  roleId: string
  tokenAddress: string
  urlName: string
  userId: string
  platform: string
}

const useClaim = () => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const { tokenAddress, serverId, urlName, platform, dropContractType } = useDrop()
  const userId = useUserId(platform)
  const toast = useToast()

  const claimFunction = useMemo(() => {
    if (dropContractType === "NFT") return claim
    if (dropContractType === "ERC20") return erc20Claim
    return null
  }, [dropContractType])

  const fetcher = async (roleId: string) =>
    claimFunction?.(
      chainId,
      account,
      library.getSigner(account),
      { roleId, tokenAddress, serverId, urlName, platform, userId },
      library
    )

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
