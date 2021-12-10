import { Center, HStack, Text } from "@chakra-ui/react"
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
  <Center width="full" minHeight="sm">
    <input id="dropzone" {...inputProps} hidden />
    <Center
      {...dropzoneProps}
      borderColor="yellow.500"
      borderWidth={2}
      borderRadius="3xl"
      _hover={{ cursor: "pointer" }}
      as="label"
      htmlFor="dropzone"
      width="full"
      height="full"
      color="yellow.500"
      fontSize="lg"
      transition="0.1s linear"
    >
      {isDragActive ? (
        <Text>Drop the files here</Text>
      ) : (
        <HStack>
          <FilePlus size={30} />
          <Text>Add image(s)</Text>
        </HStack>
      )}
    </Center>
  </Center>
)

export default AddNftButton
