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
import useIsActive from "hooks/airdrop/useIsActive"
import useIsClaimed from "hooks/airdrop/useIsClaimed"
import useIsAuthenticated from "hooks/discord/useIsAuthenticated"
import useIsOwner from "hooks/discord/useIsOwner"
import useRoleName from "hooks/discord/useRoleName"
import useServersOfUser from "hooks/discord/useServersOfUser"
import useUserRoles from "hooks/discord/useUserRoles"
import useClaimMachine from "hooks/machines/useClaimMachine"
import useRoleData from "hooks/roletoken/useRoleData"
import Image from "next/image"
import { Check } from "phosphor-react"
import { ReactElement, useMemo } from "react"
import StopAirdropButton from "./components/StopAirdropButton"

type Props = {
  roleId: string
  role: RoleData
  tokenAddress: string
  serverId: string
  urlName: string
}

const ClaimCard = ({
  roleId,
  role,
  tokenAddress,
  serverId,
  urlName,
}: Props): ReactElement => {
  const { account } = useWeb3React()
  const userServers = useServersOfUser()
  const roleData = useRoleData(tokenAddress, serverId, roleId, role)
  const { isLoading, isSuccess, onSubmit } = useClaimMachine()
  const isClaimed = useIsClaimed(serverId, roleId, tokenAddress)
  const roleName = useRoleName(serverId, roleId)
  const userRoles = useUserRoles(serverId)
  const canClaim = Object.keys(userRoles ?? {}).includes(roleId)
  const isAuthenticated = useIsAuthenticated()
  const isOwner = useIsOwner(serverId)
  const isActive = useIsActive(serverId, roleId, tokenAddress)

  const [buttonText, tooltipLabel] = useMemo(() => {
    if (isClaimed || isSuccess) return ["Claimed", null]
    if (!isActive) return ["Claim", "This role is inactive in this drop"]
    if (!canClaim) return ["No Permission", `You don't have the role '${roleName}'`]
    if (!account) return ["Claim", "Connect your wallet to claim"]
    if (!isAuthenticated) return ["Claim", "You are not authenticated"]
    return ["Claim", null]
  }, [isClaimed, isSuccess, canClaim, roleName, isAuthenticated, account, isActive])

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
          {isOwner && (
            <StopAirdropButton
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
              {roleData?.traits.map(([key, value]) => (
                <Text key={`${key}-${value}`}>
                  {key}: {value}
                </Text>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Tooltip label={tooltipLabel} isDisabled={tooltipLabel === null}>
          <Box>
            <Button
              leftIcon={isClaimed || isSuccess ? <Check /> : null}
              isLoading={isLoading}
              isDisabled={
                !isActive ||
                !canClaim ||
                isClaimed ||
                isSuccess ||
                !userServers?.includes(serverId)
              }
              w="full"
              colorScheme="yellow"
              onClick={() => onSubmit({ roleId, serverId, tokenAddress })}
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
