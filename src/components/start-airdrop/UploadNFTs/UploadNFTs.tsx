import { FormControl, FormErrorMessage, Grid, VStack } from "@chakra-ui/react"
import useDropzone from "hooks/useDropzone"
import { ReactElement, useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import AddNftButton from "./components/AddNftButton"
import RoleCard from "./components/RoleCard"

const PickRoles = (): ReactElement => {
  const { setValue } = useFormContext()
  const { errors } = useFormState()
  const nfts = useWatch({ name: "nfts" })

  const { getRootProps, getInputProps, isDragActive, files, progresses } =
    useDropzone()

  useEffect(() => {
    const newNfts = { ...nfts }
    Object.entries(files).forEach(
      ([id, file]) =>
        (newNfts[id] = {
          file,
          name: newNfts[id]?.name ?? "",
          traits: newNfts[id]?.traits ?? [
            { key: "", value: "" },
            { key: "", value: "" },
          ],
          roles: newNfts[id]?.roles ?? [],
        })
    )
    setValue("nfts", newNfts)
  }, [files, setValue]) // Not including "nfts" since its value is being updated in the useEffect

  return (
    <FormControl isInvalid={errors.roles?.message?.length > 0}>
      <VStack spacing={10}>
        <Grid width="full" templateColumns="repeat(3, 1fr)" gap={5}>
          {Object.keys(nfts).map((id) => (
            <RoleCard key={id} nftId={id} progress={progresses[id] ?? 0} />
          ))}
          <AddNftButton
            dropzoneProps={getRootProps()}
            inputProps={getInputProps()}
            isDragActive={isDragActive}
          />
        </Grid>

        {errors.roles?.message && (
          <FormErrorMessage>{errors.roles.message}</FormErrorMessage>
        )}
      </VStack>
    </FormControl>
  )
}

export default PickRoles
