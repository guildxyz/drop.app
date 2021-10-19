import {
  Box,
  CheckboxProps,
  Fade,
  Input,
  useCheckbox,
  VStack,
} from "@chakra-ui/react"
import PhotoUploader from "components/common/PhotoUploader"
import useAirdrop from "hooks/useAirdrop"
import useIsActive from "hooks/useIsActive"
import { Dispatch, ReactElement, SetStateAction, useEffect } from "react"

type Props = {
  id: string
  name: string
  images: Record<string, File>
  setImages: Dispatch<SetStateAction<Record<string, File>>>
  inputHashes: Record<string, string>
  setInputHashes: Dispatch<SetStateAction<Record<string, string>>>
  serverId: string
  tokenAddress: string
} & CheckboxProps

const RoleCheckbox = ({
  id,
  name,
  images,
  setImages,
  inputHashes,
  setInputHashes,
  serverId,
  tokenAddress,
  ...checkBoxProps
}: Props): ReactElement => {
  const {
    getInputProps,
    getCheckboxProps,
    state: { isChecked },
  } = useCheckbox(checkBoxProps)
  const { uploadedImages } = useAirdrop()
  const input = getInputProps()
  const checkbox = getCheckboxProps()
  const isActive = useIsActive(serverId, id, tokenAddress)
  useEffect(
    () =>
      console.log({
        serverId,
        id,
        tokenAddress,
      }),
    []
  )

  if (isActive) return null

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
