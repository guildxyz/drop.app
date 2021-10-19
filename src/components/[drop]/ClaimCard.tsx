import { Box, Button, HStack, Skeleton, Text, VStack } from "@chakra-ui/react"
import useRoleName from "hooks/discord/useRoleName"
import { Drop } from "hooks/useAirdrop"
import useClaimMachine from "hooks/useClaimMachine"
import useIsClaimed from "hooks/useIsClaimed"
import useRoleData from "hooks/useRoleData"
import Image from "next/image"
import { Check } from "phosphor-react"
import { ReactElement } from "react"

type Props = {
  roleId: string
  drop: Drop
}

const ClaimCard = ({ roleId, drop }: Props): ReactElement => {
  const { tokenAddress, serverId } = drop
  const roleData = useRoleData(tokenAddress, serverId, roleId)
  const { isLoading, isSuccess, onSubmit } = useClaimMachine()
  const isClaimed = useIsClaimed(serverId, roleId, tokenAddress)
  const roleName = useRoleName(serverId, roleId)

  return (
    <Skeleton isLoaded={!!roleData}>
      <VStack
        key={roleId}
        alignItems="left"
        padding={5}
        shadow="lg"
        borderRadius={10}
        backgroundColor="gray.700"
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
        <Text>{roleData?.tokenName}</Text>
        <Button
          isLoading={isLoading}
          isDisabled={isClaimed || isSuccess}
          w="full"
          colorScheme="purple"
          onClick={() => onSubmit({ roleId, serverId, tokenAddress })}
        >
          {isClaimed || isSuccess ? (
            <HStack>
              <Check />
              <Text>Claimed</Text>
            </HStack>
          ) : (
            <Text>Claim</Text>
          )}
        </Button>
      </VStack>
    </Skeleton>
  )
}

export default ClaimCard