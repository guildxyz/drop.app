import {
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  Grid,
  useCheckboxGroup,
} from "@chakra-ui/react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import RoleCheckbox from "./components/RoleCheckbox"
import useRoles from "./hooks/useRoles"

const PickRoles = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)

  const { field } = useController({
    defaultValue: [],
    control,
    name: "roles",
    rules: {
      validate: (value) => value.length > 0 || "You must pick at least one role",
    },
  })

  const { getCheckboxProps } = useCheckboxGroup({
    defaultValue: [],
    onChange: field.onChange,
    value: field.value,
  })

  return (
    <FormControl isInvalid={errors.roles?.message?.length > 0}>
      <Grid gridTemplateColumns="repeat(3, 1fr)" gridTemplateRows="auto" gap={5}>
        <CheckboxGroup>
          {Object.entries(roles ?? {}).map(([id, name]) => {
            const checkboxProps = getCheckboxProps({ value: id })
            return (
              <RoleCheckbox key={id} {...checkboxProps}>
                {name}
              </RoleCheckbox>
            )
          })}
        </CheckboxGroup>
      </Grid>
      {errors.roles?.message && (
        <FormErrorMessage>{errors.roles.message}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default PickRoles
