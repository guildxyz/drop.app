import { FormControl, FormErrorMessage, Grid, VStack } from "@chakra-ui/react"
import useRoles from "hooks/discord/useRoles"
import { ReactElement } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import AddRoleButton from "./components/AddRoleButton"
import RoleCard from "./components/RoleCard"

const PickRoles = (): ReactElement => {
  const { setValue } = useFormContext()
  const { errors } = useFormState()

  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)
  const formRoles = useWatch({ name: "roles" })

  const selectRole = (id: string) => setValue(`roles.${id}`, {})

  const unselectRole = (id: string) => {
    const newFormRoles = formRoles
    delete newFormRoles[id]
    setValue(`roles`, newFormRoles)
  }

  return (
    <FormControl isInvalid={errors.roles?.message?.length > 0}>
      <VStack spacing={10}>
        <Grid width="full" templateColumns="repeat(5, 1fr)" gap={5}>
          {Object.entries(roles ?? {})
            .filter(([id]) => !(id in formRoles))
            .map(([id, name]) => (
              <AddRoleButton
                key={id}
                setSelected={() => selectRole(id)}
                roleName={name}
                roleId={id}
              />
            ))}
        </Grid>

        {Object.keys(formRoles ?? {}).length > 0 && (
          <Grid width="full" templateColumns="repeat(3, 1fr)" gap={5}>
            {Object.keys(formRoles ?? {}).map((roleId) => (
              <RoleCard
                key={roleId}
                roleId={roleId}
                unselectRole={() => unselectRole(roleId)}
              />
            ))}
          </Grid>
        )}

        {errors.roles?.message && (
          <FormErrorMessage>{errors.roles.message}</FormErrorMessage>
        )}
      </VStack>
    </FormControl>
  )
}

export default PickRoles
