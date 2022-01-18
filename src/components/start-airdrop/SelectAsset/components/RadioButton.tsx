import { Box, Tooltip, useRadio } from "@chakra-ui/react"
import React, { PropsWithChildren, ReactElement } from "react"

const RadioButton = ({
  children,
  ...radioProps
}: PropsWithChildren<any>): ReactElement => {
  const { getInputProps, getCheckboxProps } = useRadio(radioProps)
  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Tooltip label={radioProps.disabled ? "Coming soon" : ""}>
      <Box as="label">
        {!radioProps.disabled && <input {...input} />}
        <Box
          {...(radioProps.disabled
            ? { backgroundColor: "gray.300", color: "gray.500" }
            : checkbox)}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="xl"
          // boxShadow={radioProps.disabled ? "" : "md"}
          _checked={{
            bg: "yellow.500",
            color: "white",
            borderColor: "yellow.500",
          }}
          px={5}
          py={3}
          textAlign="center"
          backgroundColor="white"
        >
          {children}
        </Box>
      </Box>
    </Tooltip>
  )
}

export default RadioButton
