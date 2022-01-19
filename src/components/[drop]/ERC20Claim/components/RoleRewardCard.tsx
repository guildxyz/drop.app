import { Box, Button, HStack, Text, Tooltip } from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import { formatEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import useClaim from "components/[drop]/ClaimCard/hooks/useClaim"
import useRoleName from "components/[drop]/ClaimCard/hooks/useRoleName"
import useUserRoles from "components/[drop]/ClaimCard/hooks/useUserRoles"
import useTokenSymbol from "components/[drop]/DropBalance/hooks/useTokenSymbol"
import { useDrop } from "components/[drop]/DropProvider"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import { useMemo } from "react"
import useIsTokenClaimed from "../hooks/useIsTokenClaimed"
import RoleSettingsMenu from "./RoleSettingsMenu"

type Props = {
  roleId: string
  reward: string
}

const RoleRewardCard = ({ roleId, reward }: Props) => {
  const { account } = useWeb3React()
  const roleName = useRoleName(roleId)
  const { tokenAddress, platform, ownerAddress } = useDrop()
  const symbol = useTokenSymbol(tokenAddress)
  const { isLoading, response, onSubmit } = useClaim()
  const successfullyClaimed = !!response
  const isClaimed = useIsTokenClaimed(roleId)
  const userRoles = useUserRoles()
  const canClaim = useMemo(
    () => Object.keys(userRoles ?? {}).includes(roleId),
    [roleId, userRoles]
  )
  const isAuthenticated = useIsAuthenticated(platform)
  const isActive = useMemo(() => !BigNumber.from(reward).isZero(), [reward])
  const isOwner = ownerAddress === account

  const [buttonText, tooltipLabel] = useMemo(() => {
    if (!isActive) return ["Claim", "This role is inactive in this drop"]
    if (!account) return ["Claim", "Connect your wallet to claim"]
    if (!isAuthenticated) return ["Claim", "You are not authenticated"]
    if (!canClaim) return ["No Permission", `You don't have the role '${roleName}'`]
    if (isClaimed || successfullyClaimed)
      return ["Claimed", "You already claimed for this role"]
    return [`Claim ${formatEther(reward)} ${symbol || "SYMBL"}`, null]
  }, [
    isClaimed,
    successfullyClaimed,
    symbol,
    canClaim,
    roleName,
    account,
    isAuthenticated,
    isActive,
    reward,
  ])

  const isDisabled = typeof tooltipLabel === "string"

  return (
    <Card p={5}>
      <HStack justifyContent="space-between">
        <Text>{roleName ?? "Loading..."}</Text>
        <HStack>
          <Tooltip label={tooltipLabel} isDisabled={!isDisabled}>
            <Box>
              <Button
                isDisabled={isDisabled}
                isLoading={isLoading}
                colorScheme="yellow"
                variant="outline"
                onClick={() => onSubmit(roleId)}
              >
                {buttonText}
              </Button>
            </Box>
          </Tooltip>
          {isOwner && <RoleSettingsMenu roleId={roleId} />}
        </HStack>
      </HStack>
    </Card>
  )
}

export default RoleRewardCard
