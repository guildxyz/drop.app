import {
  FormControl,
  FormErrorMessage,
  Input,
  useRadioGroup,
} from "@chakra-ui/react"
import DropdownRadio from "components/common/DropdownRadio"
import { useController, useFormContext, useFormState } from "react-hook-form"

const InputNFT = () => {
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
      <FormControl isInvalid={errors.NFT?.name}>
        <Input
          type="text"
          {...register("NFT.name", {
            required: "Please input an NFT name",
          })}
          placeholder="Name"
        />
        {errors.NFT?.name?.message && (
          <FormErrorMessage>{errors.NFT.name.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={errors.NFT?.symbol}>
        <Input
          type="text"
          {...register("NFT.symbol", {
            required: "Please input an NFT symbol",
          })}
          placeholder="Symbol"
        />
        {errors.NFT?.symbol && (
          <FormErrorMessage>{errors.NFT.symbol.message}</FormErrorMessage>
        )}
      </FormControl>
    </DropdownRadio>
  )
}

export default InputNFT
