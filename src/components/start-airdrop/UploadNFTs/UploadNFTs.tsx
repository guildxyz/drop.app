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
import { ReactElement } from "react"
import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import ipfsUpload from "utils/ipfsUpload"
import AddNftButton from "./components/AddNftButton"
import RoleCard from "./components/RoleCard"
import useRoles from "./hooks/useRoles"

const UploadNFTs = (): ReactElement => {
  const { setValue, trigger } = useFormContext()
  const { errors } = useFormState()
  const nfts = useWatch({ name: "nfts" })
  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)

  const { fields, append, remove } = useFieldArray({ name: "nfts" })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const prevLength = nfts.length

      append(
        acceptedFiles.map((file) => ({
          file,
          name: "",
          roles: [],
          traits: [
            { key: "", value: "" },
            { key: "", value: "" },
          ],
          preview: URL.createObjectURL(file),
          progress: 0,
        }))
      )

      Promise.all(
        acceptedFiles.map((file, index) =>
          file.arrayBuffer().then((buffer) =>
            ipfsUpload(buffer, (progress) => {
              setValue(`nfts.${prevLength + index}.progress`, progress)
            }).then((result) =>
              setValue(`nfts.${prevLength + index}.hash`, result.path)
            )
          )
        )
      ).catch((error) => console.error("Failed to upload images", error))
    },
  })

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
            {fields.map((field, index) => (
              <RoleCard
                key={field.id}
                nftIndex={index}
                removeNft={() => remove(index)}
              />
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

export default UploadNFTs
