import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react"
import useAirdrop from "hooks/useAirdrop"
import { ReactElement } from "react"
import { useFormContext } from "react-hook-form"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const NameInput = (): ReactElement => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const { getDataOfDrop } = useAirdrop()

  return (
    <FormControl isInvalid={!!errors?.name}>
      <Input
        maxWidth="sm"
        type="text"
        placeholder="name"
        {...register("name", {
          required: "This field is required",
          validate: async (value) =>
            getDataOfDrop(value).then(
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
