import { Box, HStack, RadioProps, Text, useRadio } from "@chakra-ui/react"
import useTokenName from "hooks/roletoken/useTokenName"
import useTokenSymbol from "hooks/roletoken/useTokenSymbol"
import { PropsWithChildren, ReactElement } from "react"

type Props = {
  address?: string
} & RadioProps

const Token = ({
  address,
  children,
  ...props
}: PropsWithChildren<Props>): ReactElement => {
  const { getInputProps, getCheckboxProps } = useRadio(props)
  const name = useTokenName(address)
  const symbol = useTokenSymbol(address)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <HStack
        {...checkbox}
        cursor="pointer"
        borderRadius="xl"
        backgroundColor="gray.200"
        _checked={{
          bg: "yellow.500",
          color: "white",
          borderColor: "yellow.500",
        }}
        px={5}
        py={3}
        justifyContent="space-between"
      >
        {children ? (
          children
        ) : (
          <>
            <Text>
              {name} ({symbol})
            </Text>

            <Text>{address}</Text>
          </>
        )}
      </HStack>
    </Box>
  )
}

export default Token
