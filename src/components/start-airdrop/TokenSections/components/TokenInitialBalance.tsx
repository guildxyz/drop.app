import {
  FormControl,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"

const TokenInitialBalance = () => {
  const { register } = useFormContext()
  const { errors } = useFormState()
  const assetType = useWatch({ name: "assetType" })

  return (
    <FormControl width="xs" isInvalid={!!errors?.assetData?.TOKEN?.initialBalance}>
      <NumberInput min={0} size="lg">
        <NumberInputField
          width="full"
          type="number"
          placeholder="100000"
          {...register("assetData.TOKEN.initialBalance", {
            required: assetType === "TOKEN" && "This field is required",
          })}
        />
      </NumberInput>
      <FormErrorMessage>
        {errors?.assetData?.TOKEN?.initialBalance?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TokenInitialBalance
