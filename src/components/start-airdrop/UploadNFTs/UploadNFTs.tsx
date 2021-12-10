import {
  Alert,
  AlertIcon,
  chakra,
  FormControl,
  FormErrorMessage,
  Grid,
  VStack,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
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

  const { getRootProps, getInputProps, isDragActive, files, removeFile } =
    useDropzone({
      onDrop: (acceptedFiles) =>
        acceptedFiles.forEach((file) => {
          setValue(`nfts.${file.id}.file`, {
            preview: file.preview,
            progress: file.progress,
          })
          setValue(`nfts.${file.id}.name`, "")
          setValue(`nfts.${file.id}.roles`, [])
          setValue(`nfts.${file.id}.traits`, [
            { key: "", value: "" },
            { key: "", value: "" },
          ])
        }),
    })

  useEffect(() => {
    Object.entries(files).forEach(([id, file]) => setValue(`nfts.${id}.file`, file))
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
              <RoleCard key={id} nftId={id} removeFile={removeFile} />
            ))}
            <motion.div whileTap={{ scale: 0.95 }}>
              <AddNftButton
                dropzoneProps={getRootProps()}
                inputProps={getInputProps()}
                isDragActive={isDragActive}
              />
            </motion.div>
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
