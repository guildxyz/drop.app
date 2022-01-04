import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react"
import { RoleData } from "contract_interactions/types"
import Image from "next/image"
import { ReactElement, useMemo } from "react"
import DiscordClaimButton from "./components/DiscordClaimButton"
import StopAirdropButton from "./components/StopAirdropButton"
import TelegramClaimButton from "./components/TelegramClaimButton"
import useIsDeployer from "./hooks/useIsDeployer"
import useRoleData from "./hooks/useRoleData"
import useRoleName from "./hooks/useRoleName"

type Props = {
  roleId: string
  role: RoleData
  tokenAddress: string
  serverId: string
  urlName: string
  platform: "DISCORD" | "TELEGRAM"
}

const ClaimCard = ({
  roleId,
  role,
  tokenAddress,
  serverId,
  urlName,
  platform,
}: Props): ReactElement => {
  const roleData = useRoleData(tokenAddress, platform, roleId, role)
  const roleName = useRoleName(serverId, roleId, platform)
  const isDeployer = useIsDeployer(tokenAddress)
  const ClaimButton = useMemo(
    () => (platform === "TELEGRAM" ? TelegramClaimButton : DiscordClaimButton),
    [platform]
  )

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
            src={`https://ipfs.fleek.co/ipfs/${roleData?.image?.split("/").pop()}`}
            alt={`Image of ${"ROLE NAME"} role`}
            layout="fill"
            objectFit="cover"
          />
        </Box>
        <Accordion allowMultiple>
          <AccordionItem border="none">
            <AccordionButton>
              <HStack width="full" justifyContent="space-between">
                <Text>{roleData?.name}</Text>
                <AccordionIcon />
              </HStack>
            </AccordionButton>
            <AccordionPanel pb={4}>
              {roleData?.attributes.map(({ trait_type, value }) => (
                <Text key={`${trait_type}-${value}`}>
                  {trait_type}: {value}
                </Text>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <ClaimButton
          {...{
            roleId,
            tokenAddress,
            serverId,
            urlName,
            platform,
          }}
        />
      </VStack>
    </Skeleton>
  )
}

export default ClaimCard
