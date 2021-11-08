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
import { Drop } from "contract_interactions/types"
import useIsClaimed from "hooks/airdrop/useIsClaimed"
import useIsAuthenticated from "hooks/discord/useIsAuthenticated"
import useRoleName from "hooks/discord/useRoleName"
import useServersOfUser from "hooks/discord/useServersOfUser"
import useUserRoles from "hooks/discord/useUserRoles"
import useClaimMachine from "hooks/machines/useClaimMachine"
import useRoleData from "hooks/roletoken/useRoleData"
import Image from "next/image"
import { Check } from "phosphor-react"
import { ReactElement, useMemo } from "react"

type Props = {
  roleId: string
  drop: Drop
}

const ClaimCard = ({ roleId, drop }: Props): ReactElement => {
  const { tokenAddress, serverId } = drop
  const userServers = useServersOfUser()
  const roleData = useRoleData(tokenAddress, serverId, roleId)
  const { isLoading, isSuccess, onSubmit } = useClaimMachine()
  const isClaimed = useIsClaimed(serverId, roleId, tokenAddress)
  const roleName = useRoleName(serverId, roleId)
  const userRoles = useUserRoles(serverId)
  const canClaim = Object.keys(userRoles ?? {}).includes(roleId)
  const isAuthenticated = useIsAuthenticated()

  const [buttonText, tooltipLabel] = useMemo(() => {
    if (!isAuthenticated) return ["Claim", "You are not authenticated"]
    if (isClaimed || isSuccess) return ["Claimed", null]
    if (!canClaim) return ["No Permission", `You don't have the role '${roleName}'`]
    return ["Claim", null]
  }, [isClaimed, isSuccess, canClaim, roleName, isAuthenticated])

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
        <Text>{roleName}</Text>
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
                !canClaim ||
                isClaimed ||
                isSuccess ||
                !userServers?.includes(serverId)
              }
              w="full"
              colorScheme="purple"
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
