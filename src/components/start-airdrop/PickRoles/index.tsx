import {
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  Grid,
  useCheckboxGroup,
} from "@chakra-ui/react"
import useRoles from "hooks/discord/useRoles"
import useDeployedTokens from "hooks/useDeployedTokens"
import { ReactElement, useEffect, useState } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import RoleCheckbox from "./components/RoleCheckbox"

const PickRoles = (): ReactElement => {
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
  const contractId = useWatch({ name: "contractId" })
  const { deployedTokens } = useDeployedTokens()
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
          {Object.entries(roles ?? {}).map(([id, name]) => (
            <RoleCheckbox
              key={id}
              images={images}
              inputHashes={inputHashes}
              setImages={setImages}
              setInputHashes={setInputHashes}
              name={name}
              id={id}
              serverId={serverId}
              tokenAddress={deployedTokens?.[contractId]}
              {...getCheckboxProps({ value: id })}
            />
          ))}
        </CheckboxGroup>
      </Grid>
      {errors.roles?.message && (
        <FormErrorMessage>{errors.roles.message}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default PickRoles
