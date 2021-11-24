import { FormControl, FormErrorMessage, Input, RadioProps } from "@chakra-ui/react"
import DropdownRadio from "components/common/DropdownRadio"
import { ReactElement } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"

const InputNFT = (props: RadioProps): ReactElement => {
  const { register } = useFormContext()
  const { errors } = useFormState()
  const assetType = useWatch({ name: "assetType" })

  return (
    <DropdownRadio title="NFT" {...props}>
      <FormControl isInvalid={errors.assetData?.NFT?.name}>
        <Input
          type="text"
          {...register("assetData.NFT.name", {
            required: assetType === "NFT" && "Please input an NFT name",
          })}
          placeholder="Name"
        />
        {errors.assetData?.NFT?.name?.message && (
          <FormErrorMessage>{errors.assetData.NFT.name.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={errors.assetData?.NFT?.symbol}>
        <Input
          type="text"
          {...register("assetData.NFT.symbol", {
            required: assetType === "NFT" && "Please input an NFT symbol",
          })}
          placeholder="Symbol"
        />
        {errors.assetData?.NFT?.symbol && (
          <FormErrorMessage>{errors.assetData.NFT.symbol.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={errors.assetData?.NFT?.description}>
        <Input
          as="textarea"
          type="text"
          {...register("assetData.NFT.description", {
            required: assetType === "NFT" && "Please input an NFT description",
          })}
          placeholder="Description"
        />
        {errors.assetData?.NFT?.description && (
          <FormErrorMessage>
            {errors.assetData.NFT.description.message}
          </FormErrorMessage>
        )}
      </FormControl>
    </DropdownRadio>
  )
}

export default InputNFT
