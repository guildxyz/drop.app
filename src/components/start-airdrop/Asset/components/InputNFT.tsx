import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react"
import DropdownRadio from "components/common/DropdownRadio"
import { ReactElement } from "react"
import { useFormContext, useFormState } from "react-hook-form"

const InputNFT = (props): ReactElement => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  return (
    <DropdownRadio title="NFT" {...props}>
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
