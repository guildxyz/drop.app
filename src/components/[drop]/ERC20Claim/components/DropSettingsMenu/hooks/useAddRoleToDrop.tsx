import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useRoleName from "components/[drop]/ClaimCard/hooks/useRoleName"
import { useDrop } from "components/[drop]/DropProvider"
import addRoleToDrop from "contract_interactions/ERC20Drop/addRoleToDrop"
import addRoleToDropSignature from "contract_interactions/utils/signatures/addRoleToDrop"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import { mutate } from "swr"

const useAddRoleToDrop = (roleId: string, roleNameFallback?: string) => {
  const { chainId, library, account } = useWeb3React<Web3Provider>()
  const { urlName, serverId, tokenAddress, platform, dropContractType } = useDrop()
  const toast = useToast()
  const roleName = useRoleName(roleId, roleNameFallback)

  const fetcher = useCallback(
    async ({ newReward }) => {
      const signature = await addRoleToDropSignature(
        chainId,
        serverId,
        platform,
        account,
        roleId,
        urlName
      )

      const tx = await addRoleToDrop(
        chainId,
        library.getSigner(account),
        signature,
        urlName,
        roleId,
        newReward,
        "", // TODO channelId
        library
      )
      await tx.wait()
      await mutate([
        "roleData",
        chainId,
        urlName,
        serverId,
        tokenAddress,
        library,
        platform,
        dropContractType,
      ])
      return tx
    },
    [
      chainId,
      library,
      account,
      urlName,
      roleId,
      serverId,
      tokenAddress,
      platform,
      dropContractType,
    ]
  )

  const onSuccess = useCallback(
    () =>
      toast({
        status: "success",
        title: "Added",
        description: `Role "${roleName}" added to the drop`,
      }),
    [toast, roleName]
  )

  const onError = useCallback(
    (error) =>
      toast({
        status: "error",
        title: "Start failed",
        description:
          error.message ||
          "Failed to start airdrop, please double check your gas prices and try again",
      }),
    [toast]
  )

  return useSubmit(fetcher, { onSuccess, onError })
}

export default useAddRoleToDrop
