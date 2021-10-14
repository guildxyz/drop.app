import {
  Accordion,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  Grid,
  useCheckboxGroup,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import RoleCheckbox from "./components/RoleCheckbox"
import useRoles from "./hooks/useRoles"

const PickRoles = () => {
  const [images, setImages] = useState<Record<string, File>>({})
  const [inputHashes, setInputHashes] = useState<Record<string, string>>({})

  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext()

  useEffect(() => setValue("images", images), [setValue, images])
  useEffect(() => setValue("inputHashes", inputHashes), [setValue, inputHashes])

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
              <Accordion allowToggle key={id}>
                <RoleCheckbox
                  images={images}
                  inputHashes={inputHashes}
                  setImages={setImages}
                  setInputHashes={setInputHashes}
                  name={name}
                  id={id}
                  {...checkboxProps}
                />
              </Accordion>
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
