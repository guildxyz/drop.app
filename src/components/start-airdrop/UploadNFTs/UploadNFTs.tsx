import {
  Alert,
  AlertIcon,
  chakra,
  FormControl,
  FormErrorMessage,
  Grid,
  VStack,
} from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { AnimateSharedLayout } from "framer-motion"
import useDropzone from "hooks/useDropzone"
import { ReactElement, useEffect } from "react"
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

const UploadNFTs = (): ReactElement => {
  const { setValue, trigger, setError, clearErrors } = useFormContext()
  const { errors, dirtyFields } = useFormState()
  const nfts = useWatch({ name: "nfts" })
  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)

  const { fields, append, remove } = useFieldArray({ name: "nfts" })

  useEffect(() => {
    if (fields.length <= 0 && !!dirtyFields.nfts)
      setError("nfts", { message: "Choose at least one NFT" })
    else clearErrors("nfts")
  }, [fields, dirtyFields, setError, clearErrors])

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
          hash: "",
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

      <FormControl isInvalid={errors.nfts?.message?.length > 0}>
        <VStack spacing={5} id="upload-nfts">
          <Grid width="full" templateColumns="repeat(3, 1fr)" gap={5}>
            <AnimateSharedLayout>
              {fields.map((field, index) => (
                <NftCard
                  key={field.id}
                  nftIndex={index}
                  removeNft={() => remove(index)}
                />
              ))}
              <CardMotionWrapper>
                <AddNftButton
                  dropzoneProps={getRootProps()}
                  inputProps={getInputProps()}
                  isDragActive={isDragActive}
                />
              </CardMotionWrapper>
            </AnimateSharedLayout>
          </Grid>

          <FormErrorMessage w="full">{errors.nfts?.message}</FormErrorMessage>
        </VStack>
      </FormControl>
    </>
  )
}

export default UploadNFTs
