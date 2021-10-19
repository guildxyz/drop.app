import { Box, HStack, Text, useRadio } from "@chakra-ui/react"
import useTokenName from "hooks/useTokenName"
import useTokenSymbol from "hooks/useTokenSymbol"
import { ReactElement } from "react"

const Token = ({ address, ...props }): ReactElement => {
  const { getInputProps, getCheckboxProps } = useRadio(props)
  const name = useTokenName(address)
  const symbol = useTokenSymbol(address)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label" key={address}>
      <input {...input} />
      <HStack
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
        justifyContent="space-between"
      >
        <Text>
          {name} ({symbol})
        </Text>

        <Text>{address}</Text>
      </HStack>
    </Box>
  )
}

export default Token
