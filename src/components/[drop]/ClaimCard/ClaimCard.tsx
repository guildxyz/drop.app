import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { RoleData } from "contract_interactions/types"
import useDiscordId from "hooks/useDiscordId"
import useIsActive from "hooks/useIsActive"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import useServersOfUser from "hooks/useServersOfUser"
import Image from "next/image"
import { Check } from "phosphor-react"
import { ReactElement, useEffect, useMemo } from "react"
import StopAirdropButton from "./components/StopAirdropButton"
import useClaim from "./hooks/useClaim"
import useIsClaimed from "./hooks/useIsClaimed"
import useIsDeployer from "./hooks/useIsDeployer"
import useRoleData from "./hooks/useRoleData"
import useRoleName from "./hooks/useRoleName"
import useUserRoles from "./hooks/useUserRoles"

type Props = {
  roleId: string
  role: RoleData
  tokenAddress: string
  serverId: string
  urlName: string
  platform: string
}

const ClaimCard = ({
  roleId,
  role,
  tokenAddress,
  serverId,
  urlName,
  platform,
}: Props): ReactElement => {
  const { account } = useWeb3React()
  const userServers = useServersOfUser()
  const roleData = useRoleData(tokenAddress, platform, roleId, role)
  const { isLoading, response, onSubmit } = useClaim()
  const successfullyClaimed = !!response
  const isClaimed = useIsClaimed(serverId, roleId, tokenAddress)
  const roleName = useRoleName(serverId, roleId)
  const userRoles = useUserRoles(serverId)
  const isAuthenticated = useIsAuthenticated()
  const isDeployer = useIsDeployer(tokenAddress)
  const { isActive } = useIsActive(platform, roleId, tokenAddress)
  const canClaim = useMemo(
    () => Object.keys(userRoles ?? {}).includes(roleId),
    [userRoles, roleId]
  )
  const userId = useDiscordId()

  useEffect(() => console.log(roleData), [roleData])

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
    <Skeleton isLoaded={!!roleData}>
      <VStack
        key={roleId}
        alignItems="left"
        padding={5}
        borderRadius={10}
        backgroundColor="primary.100"
        borderWidth="1px"
      >
        <HStack justifyContent="space-between">
          <Text>{roleName}</Text>
          {isDeployer && (
            <StopAirdropButton
              platform={platform}
              urlName={urlName}
              roleId={roleId}
              serverId={serverId}
              tokenAddress={tokenAddress}
            />
          )}
        </HStack>
        <Box
          position="relative"
          height={60}
          w="full"
          borderRadius={10}
          overflow="hidden"
        >
          <Image
            src={`https://ipfs.fleek.co/ipfs/${roleData?.imageHash}`}
            alt={`Image of ${"ROLE NAME"} role`}
            layout="fill"
            objectFit="cover"
          />
        </Box>
        <Accordion allowMultiple>
          <AccordionItem border="none">
            <AccordionButton>
              <HStack width="full" justifyContent="space-between">
                <Text>{roleData?.tokenName}</Text>
                <AccordionIcon />
              </HStack>
            </AccordionButton>
            <AccordionPanel pb={4}>
              {roleData?.traits.map((key, index) => (
                <Text key={`${key}-${roleData?.values?.[index]}`}>
                  {key}: {roleData?.values?.[index]}
                </Text>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
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
                  platform: "DISCORD",
                  userId,
                })
              }
            >
              {buttonText}
            </Button>
          </Box>
        </Tooltip>
      </VStack>
    </Skeleton>
  )
}

export default ClaimCard
