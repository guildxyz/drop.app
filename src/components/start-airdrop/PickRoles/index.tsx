import { FormControl, FormErrorMessage, Grid, VStack } from "@chakra-ui/react"
import useRoles from "hooks/discord/useRoles"
import { ReactElement, useState } from "react"
import { useFormState, useWatch } from "react-hook-form"
import AddRoleButton from "./components/AddRoleButton"
import RoleCard from "./components/RoleCard"

const PickRoles = (): ReactElement => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const { errors } = useFormState()

  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)

  return (
    <FormControl isInvalid={errors.roles?.message?.length > 0}>
      <VStack spacing={10}>
        <Grid width="full" templateColumns="repeat(5, 1fr)" gap={5}>
          {Object.entries(roles ?? {})
            .filter(([id]) => !selectedRoles.includes(id))
            .map(([id, name]) => (
              <AddRoleButton
                key={id}
                setSelectedRoles={setSelectedRoles}
                roleName={name}
                roleId={id}
              />
            ))}
        </Grid>

        <Grid width="full" templateColumns="repeat(3, 1fr)" gap={5}>
          {selectedRoles.map((roleId) => (
            <RoleCard
              key={roleId}
              roleId={roleId}
              unselectRole={() =>
                setSelectedRoles((prev) => prev.filter((id) => id != roleId))
              }
            />
          ))}
        </Grid>

        {errors.roles?.message && (
          <FormErrorMessage>{errors.roles.message}</FormErrorMessage>
        )}
      </VStack>
    </FormControl>
  )
}

export default PickRoles
