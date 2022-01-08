import { FormControl, FormErrorMessage, Grid, VStack } from "@chakra-ui/react"
import { LayoutGroup } from "framer-motion"
import useDropzone from "hooks/useDropzone"
import { ReactElement, useCallback, useEffect, useState } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import ipfsUpload from "utils/ipfsUpload"
import AddNftButton from "./components/AddNftButton"
import NftCard from "./components/NftCard"

const UploadSingle = (): ReactElement => {
  const { setValue } = useFormContext()
  const { errors } = useFormState()
  const [progress, setProgress] = useState<number>(0)
  const [hash, setHash] = useState<string>("")
  const nft = useWatch({ name: "nfts.0" })
  const serverId = useWatch({ name: "serverId" })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setValue("nfts.0", {
        file: acceptedFiles[0],
        name: "",
        roles: [serverId],
        traits: [
          { key: "", value: "" },
          { key: "", value: "" },
        ],
        preview: URL.createObjectURL(acceptedFiles[0]),
        progress: 0,
        hash: "",
      })
    },
    [setValue, serverId]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })

  useEffect(() => {
    nft?.file
      ?.arrayBuffer()
      .then((buffer) => {
        ipfsUpload(buffer, (_progress) => setProgress(_progress)).then((result) =>
          setHash(result.path)
        )
      })
      .catch((error) => console.error("Failed to upload images", error))
  }, [nft?.file])

  return (
    <FormControl isInvalid={errors.nft?.message?.length > 0}>
      <VStack spacing={5} id="upload-nft">
        <Grid width="full" templateColumns="repeat(3, 1fr)" gap={5}>
          <LayoutGroup>
            {nft?.file ? (
              <NftCard
                shouldRenderRoleSelect={false}
                progress={progress}
                imageHash={hash}
                nftIndex={0}
                removeNft={() =>
                  setValue("nfts.0", {
                    file: null,
                    name: "",
                    roles: [],
                    traits: [
                      { key: "", value: "" },
                      { key: "", value: "" },
                    ],
                    preview: "",
                    progress: 0,
                    hash: "",
                  })
                }
              />
            ) : (
              <AddNftButton
                dropzoneProps={getRootProps()}
                inputProps={getInputProps()}
                isDragActive={isDragActive}
              />
            )}
          </LayoutGroup>
        </Grid>

        <FormErrorMessage w="full">{errors.nft?.message}</FormErrorMessage>
      </VStack>
    </FormControl>
  )
}

export default UploadSingle
