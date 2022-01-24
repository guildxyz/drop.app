import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useRoleName from "components/[drop]/ClaimCard/hooks/useRoleName"
import { useDrop } from "components/[drop]/DropProvider"
import addRoleToDrop from "contract_interactions/ERC20Drop/addRoleToDrop"
import changeRoleReward from "contract_interactions/ERC20Drop/changeRoleReward"
import getRewardOfRole from "contract_interactions/ERC20Drop/getRewardOfRole"
import addRoleToDropSignature from "contract_interactions/utils/signatures/addRoleToDrop"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import { mutate } from "swr"

const useEditRoleReward = (roleId: string, onClose: () => void) => {
  const { chainId, library, account } = useWeb3React<Web3Provider>()
  const { urlName, serverId, tokenAddress, platform, dropContractType } = useDrop()
  const toast = useToast()
  const roleName = useRoleName(roleId)

  const onSuccess = useCallback(
    (newReward) =>
      toast({
        status: "success",
        title: newReward === 0 ? "Stopped" : "Updated",
        description:
          newReward === 0
            ? roleName
              ? `Drop successfully stopped for role "${roleName}"`
              : "Drop successfully stopped"
            : roleName
            ? `Role "${roleName}" successfully updated`
            : "Drop successfully updated",
      }),
    [toast, roleName]
  )

  const fetcher = useCallback(
    async ({ newReward }) => {
      if (platform === "TELEGRAM") {
        const isActive = await getRewardOfRole(
          chainId,
          urlName,
          roleId,
          library
        ).then((reward) => !reward.isZero())
        if (!isActive) {
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
            serverId,
            library
          )
          await tx.wait()
          await mutate([
            "rolesData",
            chainId,
            urlName,
            serverId,
            tokenAddress,
            library,
            platform,
            dropContractType,
          ])
          onSuccess(newReward)
          onClose()
          return newReward
        }
      }

      const tx = await changeRoleReward(
        chainId,
        library.getSigner(account),
        urlName,
        roleId,
        newReward,
        library
      )
      await tx.wait()
      await mutate([
        "rolesData",
        chainId,
        urlName,
        serverId,
        tokenAddress,
        library,
        platform,
        dropContractType,
      ])
      onSuccess(newReward)
      onClose()
      return newReward
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
      onSuccess,
      onClose,
    ]
  )

  const onError = useCallback(
    (error) =>
      toast({
        status: "error",
        title: "Edit failed",
        description:
          error.message ||
          "Failed to edit reward, please double check your gas prices and try again",
      }),
    [toast]
  )

  return useSubmit(fetcher, { onError })
}

export default useEditRoleReward
