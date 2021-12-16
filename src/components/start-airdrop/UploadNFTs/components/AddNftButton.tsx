import { Button, Text } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
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
  <CardMotionWrapper minHeight="sm">
    <Button
      {...dropzoneProps}
      as="label"
      cursor="pointer"
      borderRadius="2xl"
      width="full"
      height="full"
      colorScheme="yellow"
      variant="outline"
      leftIcon={<FilePlus size={30} />}
      aria-label="Upload images for NFTs"
    >
      <input {...inputProps} hidden />
      {isDragActive ? <Text>Drop the files here</Text> : <Text>Add image(s)</Text>}
    </Button>
  </CardMotionWrapper>
)

export default AddNftButton
