import { Box, Button, RadioProps, useRadio, VStack } from "@chakra-ui/react"
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
      <Box mb={1} width="full" as="label">
        <input {...input} />
        <Button
          {...checkbox}
          w="full"
          _checked={{
            bg: "yellow.500",
            color: "white",
            borderColor: "yellow.500",
          }}
        >
          {title}
        </Button>
      </Box>
      {isChecked && children}
    </VStack>
  )
}

export default DropdownRadio
