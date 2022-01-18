import { FormControl, FormErrorMessage, HStack, Input } from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { contractOfDrop } from "contract_interactions/dropCenter"
import { useCallback, useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import slugify from "utils/slugify"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const TokenNameAndSymbol = () => {
  const { register, setValue } = useFormContext()
  const { errors } = useFormState()
  const { chainId, library } = useWeb3React<Web3Provider>()
  const assetType = useWatch({ name: "assetType" })
  const tokenName = useWatch({ name: "assetData.TOKEN.name" })

  useEffect(() => setValue("urlName", slugify(tokenName)), [tokenName, setValue])

  const validateName = useCallback(
    async (value) => {
      const urlName = slugify(value)
      if (["start-airdrop", "dcauth"].includes(urlName)) {
        return "Invalid name"
      }
      return contractOfDrop(chainId, urlName, library).then(
        (tokenAddress) => tokenAddress === ZERO_ADDRESS || "Drop already exists"
      )
    },
    [chainId, library]
  )

  return (
    <HStack alignItems="start">
      <FormControl width="xl" isInvalid={!!errors?.assetData?.TOKEN?.name}>
        <Input
          size="lg"
          type="text"
          placeholder="Name"
          {...register("assetData.TOKEN.name", {
            required: assetType === "TOKEN" && "This field is required",
            validate: validateName,
          })}
        />
        <FormErrorMessage>
          {errors?.assetData?.TOKEN?.name?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.assetData?.TOKEN?.symbol}>
        <Input
          width="24"
          size="lg"
          type="text"
          placeholder="SYMBL"
          {...register("assetData.TOKEN.symbol", {
            required: assetType === "TOKEN" && "This field is required",
          })}
        />
        <FormErrorMessage>
          {errors?.assetData?.TOKEN?.symbol?.message}
        </FormErrorMessage>
      </FormControl>
    </HStack>
  )
}

export default TokenNameAndSymbol
