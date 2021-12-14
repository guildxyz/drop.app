import { Box, Button, Text } from "@chakra-ui/react"
import { motion } from "framer-motion"
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
  <motion.div whileTap={{ scale: 0.95 }}>
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
        cursor="pointer"
      >
        {isDragActive ? <Text>Drop the files here</Text> : <Text>Add image(s)</Text>}
      </Button>
    </Box>
  </motion.div>
)

export default AddNftButton
