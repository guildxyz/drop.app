import {
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { contractOfDrop } from "contract_interactions/dropCenter"
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
    <VStack w="sm" alignItems="start">
      <HStack spacing={2} alignItems="start">
        <FormControl isInvalid={!!errors?.assetData?.NFT?.name}>
          <Input
            size="lg"
            type="text"
            placeholder="Name"
            {...register("assetData.NFT.name", {
              required: "This field is required",
              validate: async (value) => {
                const urlName = slugify(value)
                if (["start-airdrop", "dcauth"].includes(urlName)) {
                  return "Invalid name"
                }
                return contractOfDrop(chainId, urlName, library).then(
                  (tokenAddress) =>
                    tokenAddress === ZERO_ADDRESS || "Drop already exists"
                )
              },
            })}
          />
          <FormErrorMessage>
            {errors?.assetData?.NFT?.name?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors?.assetData?.NFT?.symbol}>
          <Input
            size="lg"
            maxWidth="24"
            type="text"
            placeholder="SYMBL"
            {...register("assetData.NFT.symbol", {
              required: "This field is required",
            })}
          />
          <FormErrorMessage>
            {errors?.assetData?.NFT?.symbol?.message}
          </FormErrorMessage>
        </FormControl>
      </HStack>
      <Input
        minH={100}
        pt={3}
        placeholder="Description"
        as="textarea"
        {...register("description", {
          required: "This field is required",
        })}
      />
    </VStack>
  )
}

export default NameInput
