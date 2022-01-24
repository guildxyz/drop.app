import { Alert, AlertIcon, Box, Button, HStack, Tooltip } from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import { formatEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import useIsGroupMember from "components/[drop]/ClaimCard/components/TelegramClaimButton/hooks/useIsGroupMember"
import useClaim from "components/[drop]/ClaimCard/hooks/useClaim"
import useTokenSymbol from "components/[drop]/DropBalance/hooks/useTokenSymbol"
import { useDrop } from "components/[drop]/DropProvider"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import { useMemo } from "react"
import useIsTokenClaimed from "../hooks/useIsTokenClaimed"
import RoleSettingsMenu from "./RoleSettingsMenu"

const TelegramSections = () => {
  const { account } = useWeb3React()
  const { serverId, platform, ownerAddress, roles, tokenAddress } = useDrop()
  const symbol = useTokenSymbol(tokenAddress)
  const reward = useMemo(() => roles?.[serverId] as string, [roles, serverId])
  const isMember = useIsGroupMember(serverId, platform)
  const isOwner = ownerAddress === account
  const isActive = useMemo(() => !BigNumber.from(reward || "0").isZero(), [reward])
  const isAuthenticated = useIsAuthenticated(platform)
  const isClaimed = useIsTokenClaimed(serverId)
  const { isLoading, response, onSubmit } = useClaim()
  const successfullyClaimed = !!response

  const isDataLoading =
    isMember === undefined ||
    isAuthenticated === undefined ||
    isActive === undefined ||
    symbol === undefined

  const [buttonText, tooltipLabel] = useMemo(() => {
    if (!isActive) return ["Claim", "This role is inactive in this drop"]
    if (!account) return ["Claim", "Connect your wallet to claim"]
    if (!isAuthenticated) return ["Claim", "You are not authenticated"]
    if (!isMember) return ["No Permission", "You are not a member of this server"]
    if (isClaimed || successfullyClaimed)
      return ["Claimed", "You already claimed for this role"]
    return [`Claim ${formatEther(reward)} ${symbol || "SYMBL"}`, null]
  }, [
    isClaimed,
    successfullyClaimed,
    symbol,
    isMember,
    account,
    isAuthenticated,
    isActive,
    reward,
  ])

  const isDisabled = typeof tooltipLabel === "string"

  if (isOwner || isActive)
    return (
      <Card p={5} mt={10} w="min">
        <HStack>
          <Tooltip label={tooltipLabel} isDisabled={!isDisabled}>
            <Box>
              <Button
                isDisabled={isDisabled}
                isLoading={isLoading || isDataLoading}
                loadingText={isLoading ? "Claiming" : "Loading"}
                colorScheme="yellow"
                variant="outline"
                onClick={() => onSubmit(serverId)}
              >
                {buttonText}
              </Button>
            </Box>
          </Tooltip>
          {isOwner && <RoleSettingsMenu roleId={serverId} />}
        </HStack>
      </Card>
    )

  return (
    <Alert status="info" mt={10}>
      <AlertIcon />
      This Drop is currently paused
    </Alert>
  )
}

export default TelegramSections
