import { Box, Button, Text } from "@chakra-ui/react"
import { FilePlus } from "phosphor-react"
import { ReactElement } from "react"
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone"

type Props = {
  dropzoneProps: DropzoneRootProps
  inputProps: DropzoneInputProps
  isDragActive: boolean
}

const AddNftButton = ({
  dropzoneProps,
  inputProps,
  isDragActive,
}: Props): ReactElement => (
  <Box width="full" minHeight="sm" height="full" position="relative">
    <input id="dropzone" {...inputProps} hidden />
    <Button
      {...dropzoneProps}
      as="label"
      htmlFor="dropzone"
      width="full"
      height="full"
      colorScheme="yellow"
      variant="outline"
      leftIcon={<FilePlus size={30} />}
      aria-label="Upload images for NFTs"
    >
      {isDragActive ? <Text>Drop the files here</Text> : <Text>Add image(s)</Text>}
    </Button>
  </Box>
)

export default AddNftButton
