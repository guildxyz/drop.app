import {
  Alert,
  AlertIcon,
  Box,
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  Grid,
  VStack,
} from "@chakra-ui/react"
import { LayoutGroup } from "framer-motion"
import useDropzone from "hooks/useDropzone"
import { ReactElement, useCallback, useEffect, useState } from "react"
import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import ipfsUpload from "utils/ipfsUpload"
import AddNftButton from "./components/AddNftButton"
import NftCard from "./components/NftCard"
import useRoles from "./hooks/useRoles"

const MultipleUpload = (): ReactElement => {
  const { trigger, setError, clearErrors } = useFormContext()
  const { errors, dirtyFields } = useFormState()
  const nfts = useWatch({ name: "nfts" })
  const serverId = useWatch({ name: "serverId" })
  const platform = useWatch({ name: "platform" })
  const inviteLink = useWatch({ name: "inviteLink" })
  const roles = useRoles(serverId, platform, inviteLink?.length > 0)
  const [progresses, setProgresses] = useState<Record<string, number>>({})
  const [hashes, setHashes] = useState<Record<string, string>>({})

  const { fields, append, remove } = useFieldArray({ name: "nfts" })

  useEffect(() => {
    if (fields.length <= 0 && !!dirtyFields.nfts)
      setError("nfts", { message: "Choose at least one NFT" })
    else clearErrors("nfts")
  }, [fields, dirtyFields, setError, clearErrors])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
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
          hash: "",
        }))
      )
    },
    [append]
  )

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
  })

  useEffect(() => {
    Promise.all(
      acceptedFiles.map((file, index) =>
        file.arrayBuffer().then((buffer) => {
          const fieldIndex = fields.length - acceptedFiles.length + index
          ipfsUpload(buffer, (progress) => {
            if (fields[fieldIndex])
              setProgresses((prev) => ({
                ...prev,
                [fields[fieldIndex].id]: progress,
              }))
          }).then((result) => {
            if (fields[fieldIndex])
              setHashes((prev) => ({
                ...prev,
                [fields[fieldIndex].id]: result.path,
              }))
          })
        })
      )
    ).catch((error) => console.error("Failed to upload images", error))
  }, [fields])

  return (
    <Box>
      <Collapse in={!roles && Object.keys(nfts).length > 0}>
        <Alert status="info" mb="5">
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
      </Collapse>

      <FormControl isInvalid={errors.nfts?.message?.length > 0}>
        <VStack spacing={5} id="upload-nfts">
          <Grid width="full" templateColumns="repeat(3, 1fr)" gap={5}>
            <LayoutGroup>
              {fields.map((field, index) => (
                <NftCard
                  key={field.id}
                  progress={progresses[field.id] ?? 0}
                  imageHash={hashes[field.id] ?? ""}
                  nftIndex={index}
                  removeNft={() => remove(index)}
                />
              ))}
              <AddNftButton
                dropzoneProps={getRootProps()}
                inputProps={getInputProps()}
                isDragActive={isDragActive}
              />
            </LayoutGroup>
          </Grid>

          <FormErrorMessage w="full">{errors.nfts?.message}</FormErrorMessage>
        </VStack>
      </FormControl>
    </Box>
  )
}

export default MultipleUpload
