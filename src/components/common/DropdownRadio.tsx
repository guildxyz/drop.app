import { Box, RadioProps, useRadio, VStack } from "@chakra-ui/react"
import { PropsWithChildren, ReactElement } from "react"

type Props = {
  title: string
} & RadioProps

const DropdownRadio = ({
  title,
  children,
  ...radioProps
}: PropsWithChildren<Props>): ReactElement => {
  const {
    getInputProps,
    getCheckboxProps,
    state: { isChecked },
  } = useRadio(radioProps)
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
          {title}
        </Box>
      </Box>
      {isChecked && children}
    </VStack>
  )
}

export default DropdownRadio
