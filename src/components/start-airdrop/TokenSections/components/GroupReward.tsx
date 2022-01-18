import {
  FormControl,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"

const GroupReward = () => {
  const { register } = useFormContext()
  const { errors } = useFormState()
  const assetType = useWatch({ name: "assetType" })
  const platform = useWatch({ name: "platform" })

  return (
    <FormControl width="xs" isInvalid={!!errors?.tokenRewards?.TELEGRAM}>
      <NumberInput min={0} size="lg">
        <NumberInputField
          width="full"
          type="number"
          placeholder="100000"
          {...register("tokenRewards.TELEGRAM", {
            required:
              assetType === "TOKEN" &&
              platform === "TELEGRAM" &&
              "This field is required",
          })}
        />
      </NumberInput>
      <FormErrorMessage>{errors?.tokenRewards?.TELEGRAM?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default GroupReward
