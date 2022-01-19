import {
  Alert,
  AlertIcon,
  chakra,
  Collapse,
  Grid,
  HStack,
  Spinner,
  Text,
} from "@chakra-ui/react"
import useRoles from "components/start-airdrop/NFTSections/components/Uploaders/hooks/useRoles"
import { useFormContext, useWatch } from "react-hook-form"
import RoleRewardCard from "./RoleRewardCard"

const RoleRewards = () => {
  const serverId = useWatch({ name: "serverId" })
  const platform = useWatch({ name: "platform" })
  const roles = useRoles(serverId, platform)
  const { trigger } = useFormContext()

  if (!roles && serverId.length > 0)
    return (
      <HStack pl={5} spacing={5}>
        <Spinner color="gray.500" />
        <Text color="gray.600">Loading...</Text>
      </HStack>
    )

  return (
    <>
      <Collapse in={!roles && serverId.length <= 0}>
        <Alert status="info" mb="5">
          <AlertIcon />
          <p>
            Once you{" "}
            <chakra.span
              onClick={() => trigger("inviteLink", { shouldFocus: true })}
              fontWeight="medium"
              cursor="pointer"
              color="yellow.500"
            >
              select a server
            </chakra.span>
            , you can select some roles for these NFTs
          </p>
        </Alert>
      </Collapse>
      <Grid templateColumns="repeat(3, 1fr)" gap={5}>
        {Object.entries(roles ?? {}).map(([roleId, roleName]) => (
          <RoleRewardCard key={roleId} roleId={roleId} roleName={roleName} />
        ))}
      </Grid>
    </>
  )
}

export default RoleRewards
