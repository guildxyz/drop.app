import {
  Alert,
  AlertIcon,
  chakra,
  FormControl,
  FormErrorMessage,
  Grid,
  VStack,
} from "@chakra-ui/react"
import useDropzone from "hooks/useDropzone"
import { ReactElement, useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import AddNftButton from "./components/AddNftButton"
import RoleCard from "./components/RoleCard"
import useRoles from "./hooks/useRoles"

const PickRoles = (): ReactElement => {
  const { setValue, trigger } = useFormContext()
  const { errors } = useFormState()
  const nfts = useWatch({ name: "nfts" })
  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)

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
    <>
      {!roles && Object.keys(nfts).length > 0 && (
        <Alert status="info">
          <AlertIcon />
          <p>
            Once you{" "}
            <chakra.span
              onClick={() => trigger("inviteLink", { shouldFocus: true })}
              fontWeight="medium"
              cursor="pointer"
              color="yellow.500"
            >
              select a server
            </chakra.span>
            , you can select some roles for these NFTs
          </p>
        </Alert>
      )}

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
    </>
  )
}

export default PickRoles
