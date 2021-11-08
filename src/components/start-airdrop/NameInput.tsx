import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { getDataOfDrop } from "contract_interactions/airdrop"
import { ReactElement, useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import slugify from "utils/slugify"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const NameInput = (): ReactElement => {
  const { chainId } = useWeb3React()
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const guildName = useWatch({ control, name: "name" })

  useEffect(() => {
    if (guildName) setValue("urlName", slugify(guildName.toString()))
  }, [guildName])

  return (
    <FormControl isInvalid={!!errors?.name}>
      <Input
        maxWidth="sm"
        type="text"
        placeholder="name"
        {...register("name", {
          required: "This field is required",
          validate: async (value) =>
            getDataOfDrop(chainId, value).then(
              ({ tokenAddress }) =>
                tokenAddress === ZERO_ADDRESS || "Drop already exists"
            ),
        })}
      />
      {errors?.name?.message && (
        <FormErrorMessage>{errors.name.message}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default NameInput
