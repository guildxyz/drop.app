import { Box, Fade, Input, useCheckbox, VStack } from "@chakra-ui/react"
import PhotoUploader from "components/common/PhotoUploader"
import useAirdrop from "hooks/useAirdrop"

const RoleCheckbox = ({
  id,
  name,
  images,
  setImages,
  inputHashes,
  setInputHashes,
  ...checkBoxProps
}) => {
  const {
    getInputProps,
    getCheckboxProps,
    state: { isChecked },
  } = useCheckbox(checkBoxProps)
  const { uploadedImages } = useAirdrop()
  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <VStack>
      <Box width="full" as="label">
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          _checked={{
            bg: "purple.600",
            color: "white",
            borderColor: "purple.600",
          }}
          px={5}
          py={3}
        >
          {name}
        </Box>
      </Box>
      {isChecked && (
        <VStack width="full">
          <PhotoUploader
            buttonShown={!inputHashes[id]}
            isDisabled={!!inputHashes[id]}
            photoPreview={
              (inputHashes[id] && `https://ipfs.fleek.co/ipfs/${inputHashes[id]}`) ||
              (images[id] && URL.createObjectURL(images[id]))
            }
            onPhotoChange={(image) => setImages({ ...images, [id]: image })}
          />
          <Fade in={!images[id]} unmountOnExit>
            <Input
              placeholder="IPFS hash"
              value={inputHashes[id]}
              onChange={({ target: { value } }) =>
                setInputHashes({ ...inputHashes, [id]: value })
              }
            />
          </Fade>
        </VStack>
      )}
    </VStack>
  )
}

export default RoleCheckbox
