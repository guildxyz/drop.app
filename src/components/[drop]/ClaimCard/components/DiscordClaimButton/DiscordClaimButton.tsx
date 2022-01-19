import { Box, Button, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import useServersOfUser from "hooks/useServersOfUser"
import { Check } from "phosphor-react"
import { useMemo } from "react"
import useClaim from "../../hooks/useClaim"
import useIsActive from "../../hooks/useIsActive"
import useIsClaimed from "../../hooks/useIsClaimed"
import useRoleName from "../../hooks/useRoleName"
import useUserRoles from "../../hooks/useUserRoles"

type Props = {
  roleId: string
}

const DiscordClaimButton = ({ roleId }: Props) => {
  const { serverId, platform } = useDrop()
  const { account } = useWeb3React()
  const userServers = useServersOfUser()
  const { isLoading, response, onSubmit } = useClaim()
  const successfullyClaimed = !!response
  const isClaimed = useIsClaimed(roleId)
  const roleName = useRoleName(roleId)
  const userRoles = useUserRoles()
  const isAuthenticated = useIsAuthenticated(platform)
  const isActive = useIsActive(roleId)
  const canClaim = useMemo(
    () => Object.keys(userRoles ?? {}).includes(roleId),
    [userRoles, roleId]
  )
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
          onClick={() => onSubmit(roleId)}
        >
          {buttonText}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default DiscordClaimButton
