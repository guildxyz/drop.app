import { Grid, Text, VStack } from "@chakra-ui/react"
import Section from "components/common/Section"
import { useMemo } from "react"
import useUserRoles from "../ClaimCard/hooks/useUserRoles"
import { useDrop } from "../DropProvider"
import RoleRewardCard from "./components/RoleRewardCard"

const ERC20Claim = () => {
  const { roles } = useDrop()
  const userRoles = useUserRoles()
  const userRoleIds = useMemo(
    () => (userRoles === undefined ? undefined : Object.keys(userRoles)),
    [userRoles]
  )

  const [claimables, nonClaimables] = useMemo(
    () =>
      Object.entries(roles)
        ?.filter(([, reward]) => reward !== "0")
        ?.reduce(
          (acc, [roleId, reward]) => {
            if (userRoleIds?.includes(roleId)) acc[0].push([roleId, reward])
            else acc[1].push([roleId, reward])
            return acc
          },
          [[], []]
        ),
    [userRoleIds, roles]
  )

  return (
    <VStack spacing={10} mt={10}>
      <Section title="Rewards for your roles">
        {claimables.length > 0 ? (
          <Grid templateColumns="repeat(2, 1fr)" gap={5}>
            {claimables.map(([roleId, reward]) => (
              <RoleRewardCard
                key={roleId}
                roleId={roleId}
                reward={reward as string}
              />
            ))}
          </Grid>
        ) : (
          <Text>
            You can't claim for any of the roles, that are currently active in this
            drop
          </Text>
        )}
      </Section>

      <Section title="Other active roles">
        {nonClaimables.length > 0 ? (
          <Grid templateColumns="repeat(2, 1fr)" gap={5}>
            {nonClaimables.map(([roleId, reward]) => (
              <RoleRewardCard
                key={roleId}
                roleId={roleId}
                reward={reward as string}
              />
            ))}
          </Grid>
        ) : (
          <Text>There aren't any additional active roles</Text>
        )}
      </Section>
    </VStack>
  )
}

export default ERC20Claim
