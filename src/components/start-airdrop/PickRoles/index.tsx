import { FormControl, FormErrorMessage, Grid, VStack } from "@chakra-ui/react"
import useRoles from "hooks/discord/useRoles"
import { ReactElement, useMemo } from "react"
import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import AddRoleButton from "./components/AddRoleButton"
import RoleCard from "./components/RoleCard"

const PickRoles = (): ReactElement => {
  const { errors } = useFormState()
  const { getValues } = useFormContext()

  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)

  const {
    fields: roleFields,
    append,
    remove,
  } = useFieldArray({
    name: "roles",
  })

  const selectedRoles = useMemo(
    () => roleFields.map((_, index) => getValues(`roles.${index}.roleId`)),
    [roleFields, getValues]
  )

  return (
    <FormControl isInvalid={errors.roles?.message?.length > 0}>
      <VStack spacing={10}>
        <Grid width="full" templateColumns="repeat(5, 1fr)" gap={5}>
          {Object.entries(roles ?? {})
            .filter(([id]) => !selectedRoles.includes(id))
            .map(([id, name]) => (
              <AddRoleButton
                key={id}
                setSelected={() => append({ roleId: id })}
                roleName={name}
                roleId={id}
              />
            ))}
        </Grid>

        <Grid width="full" templateColumns="repeat(3, 1fr)" gap={5}>
          {roleFields.map((field, index) => (
            <RoleCard
              key={field.id}
              roleId={selectedRoles[index]}
              index={index}
              unselectRole={() => remove(index)}
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
