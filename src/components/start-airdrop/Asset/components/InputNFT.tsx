import {
  FormControl,
  FormErrorMessage,
  Input,
  useRadioGroup,
} from "@chakra-ui/react"
import DropdownRadio from "components/common/DropdownRadio"
import { ReactElement } from "react"
import { useController, useFormContext, useFormState } from "react-hook-form"

const InputNFT = (): ReactElement => {
  const { register } = useFormContext()
  const { errors } = useFormState()
  const { field } = useController({
    defaultValue: "NFT",
    name: "assetType",
    rules: {
      validate: (value) => value.length > 0 || "You must pick at least one role",
    },
  })

  const { getRadioProps } = useRadioGroup({
    defaultValue: "NFT",
    onChange: field.onChange,
    value: field.value,
  })

  return (
    <DropdownRadio title="NFT" {...getRadioProps({ value: "NFT" })}>
      <FormControl isInvalid={errors.assetData?.name}>
        <Input
          type="text"
          {...register("assetData.name", {
            required: "Please input an NFT name",
          })}
          placeholder="Name"
        />
        {errors.assetData?.name?.message && (
          <FormErrorMessage>{errors.assetData.name.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={errors.assetData?.symbol}>
        <Input
          type="text"
          {...register("assetData.symbol", {
            required: "Please input an NFT symbol",
          })}
          placeholder="Symbol"
        />
        {errors.assetData?.symbol && (
          <FormErrorMessage>{errors.assetData.symbol.message}</FormErrorMessage>
        )}
      </FormControl>
    </DropdownRadio>
  )
}

export default InputNFT
