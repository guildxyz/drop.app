import { Box, Button, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useIsActive from "hooks/useIsActive"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import useServersOfUser from "hooks/useServersOfUser"
import useUserId from "hooks/useUserId"
import { Check } from "phosphor-react"
import { useMemo } from "react"
import useClaim from "../../hooks/useClaim"
import useIsClaimed from "../../hooks/useIsClaimed"
import useRoleName from "../../hooks/useRoleName"
import useUserRoles from "../../hooks/useUserRoles"

type Props = {
  roleId: string
  tokenAddress: string
  serverId: string
  urlName: string
  platform: "DISCORD" | "TELEGRAM"
}

const DiscordClaimButton = ({
  roleId,
  tokenAddress,
  serverId,
  urlName,
  platform,
}: Props) => {
  const { account } = useWeb3React()
  const userServers = useServersOfUser()
  const { isLoading, response, onSubmit } = useClaim()
  const successfullyClaimed = !!response
  const isClaimed = useIsClaimed(platform, roleId, tokenAddress)
  const roleName = useRoleName(serverId, roleId)
  const userRoles = useUserRoles(serverId)
  const isAuthenticated = useIsAuthenticated(platform)
  const isActive = useIsActive(urlName, roleId, tokenAddress)
  const canClaim = useMemo(
    () => Object.keys(userRoles ?? {}).includes(roleId),
    [userRoles, roleId]
  )
  const userId = useUserId(platform)
  const [buttonText, tooltipLabel] = useMemo(() => {
    if (!isActive) return ["Claim", "This role is inactive in this drop"]
    if (!account) return ["Claim", "Connect your wallet to claim"]
    if (!isAuthenticated) return ["Claim", "You are not authenticated"]
    if (!canClaim) return ["No Permission", `You don't have the role '${roleName}'`]
    if (isClaimed || successfullyClaimed) return ["Claimed", null]
    return ["Claim", null]
  }, [
    isClaimed,
    successfullyClaimed,
    canClaim,
    roleName,
    isAuthenticated,
    account,
    isActive,
  ])

  return (
    <Tooltip label={tooltipLabel} isDisabled={tooltipLabel === null}>
      <Box>
        <Button
          leftIcon={isClaimed || successfullyClaimed ? <Check /> : null}
          isLoading={isLoading}
          isDisabled={
            !isActive ||
            !canClaim ||
            isClaimed ||
            successfullyClaimed ||
            !userServers?.includes(serverId)
          }
          w="full"
          colorScheme="yellow"
          onClick={() =>
            onSubmit({
              roleId,
              serverId,
              tokenAddress,
              urlName,
              userId,
              platform,
            })
          }
        >
          {buttonText}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default DiscordClaimButton
