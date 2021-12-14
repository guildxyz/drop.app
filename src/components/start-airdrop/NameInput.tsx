import { FormControl, FormErrorMessage, HStack, Input } from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { getDataOfDrop } from "contract_interactions/airdrop"
import { ReactElement, useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import slugify from "utils/slugify"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const NameInput = (): ReactElement => {
  const { chainId, library } = useWeb3React<Web3Provider>()
  const { setValue, register } = useFormContext()
  const { errors } = useFormState()
  const nftName = useWatch({ name: "assetData.NFT.name" })

  useEffect(() => setValue("urlName", slugify(nftName)), [nftName, setValue])

  return (
    <HStack spacing={2}>
      <FormControl isInvalid={!!errors?.assetData?.NFT?.name} maxWidth="sm">
        <Input
          type="text"
          placeholder="name"
          {...register("assetData.NFT.name", {
            required: "This field is required",
            validate: async (value) => {
              const urlName = slugify(value)
              if (["start-airdrop", "dcauth"].includes(urlName)) {
                return "Invalid name"
              }
              return getDataOfDrop(chainId, urlName, library).then(
                ({ tokenAddress }) =>
                  tokenAddress === ZERO_ADDRESS || "Drop already exists"
              )
            },
          })}
        />
        {errors?.assetData?.NFT?.name?.message && (
          <FormErrorMessage>{errors.assetData?.NFT.name.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors?.assetData?.NFT?.symbol}>
        <Input
          maxWidth="24"
          type="text"
          placeholder="SYMBL"
          {...register("assetData.NFT.symbol", {
            required: "This field is required",
          })}
        />
        {errors?.assetData?.NFT?.symbol?.message && (
          <FormErrorMessage>{errors.assetData.NFT.symbol.message}</FormErrorMessage>
        )}
      </FormControl>
    </HStack>
  )
}

export default NameInput
