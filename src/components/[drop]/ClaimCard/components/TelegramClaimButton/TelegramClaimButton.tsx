import { Box, Button, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useIsActive from "hooks/useIsActive"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import useUserId from "hooks/useUserId"
import { Check } from "phosphor-react"
import { useMemo } from "react"
import useClaim from "../../hooks/useClaim"
import useIsClaimed from "../../hooks/useIsClaimed"
import useIsGroupMember from "./hooks/useIsGroupMember"

type Props = {
  roleId: string
  tokenAddress: string
  serverId: string
  urlName: string
  platform: "DISCORD" | "TELEGRAM"
}

const TelegramClaimButton = ({
  roleId,
  tokenAddress,
  serverId,
  urlName,
  platform,
}: Props) => {
  const { account } = useWeb3React()
  const { isLoading, response, onSubmit } = useClaim()
  const successfullyClaimed = !!response
  const isClaimed = useIsClaimed(platform, roleId, tokenAddress)
  const isAuthenticated = useIsAuthenticated(platform)
  const isActive = useIsActive(urlName, roleId, tokenAddress)
  const userId = useUserId(platform)
  const isGroupMember = useIsGroupMember(serverId, userId)

  const [buttonText, tooltipLabel] = useMemo(() => {
    if (!isActive) return ["Claim", "The drop on this NFT is inactive"]
    if (!account) return ["Claim", "Connect your wallet to claim"]
    if (!isAuthenticated) return ["Claim", "You are not authenticated"]
    if (!isGroupMember) return ["Claim", "You are not a member of this group"]
    if (isClaimed || successfullyClaimed) return ["Claimed", null]
    return ["Claim", null]
  }, [
    isClaimed,
    successfullyClaimed,
    isAuthenticated,
    account,
    isActive,
    isGroupMember,
  ])

  return (
    <Tooltip label={tooltipLabel} isDisabled={tooltipLabel === null}>
      <Box>
        <Button
          leftIcon={isClaimed || successfullyClaimed ? <Check /> : null}
          isLoading={isLoading}
          isDisabled={
            !isGroupMember || !isActive || isClaimed || successfullyClaimed
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

export default TelegramClaimButton
