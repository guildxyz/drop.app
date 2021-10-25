import { Grid, Text, useRadioGroup } from "@chakra-ui/react"
import useDeployedTokens from "hooks/useDeployedTokens"
import { ReactElement } from "react"
import { useController } from "react-hook-form"
import Token from "./components/Token"

const TokenSelect = (): ReactElement => {
  const { deployedTokens } = useDeployedTokens()

  const { field } = useController({
    defaultValue: "",
    name: "contractId",
    rules: {
      validate: (value) => value.length > 0 || "You must pick a token",
    },
  })

  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: "",
    onChange: field.onChange,
    value: field.value,
  })

  return (
    <Grid {...getRootProps()} w="full" gap={5}>
      {deployedTokens?.length > 0 &&
        deployedTokens.map((address, index) => (
          <Token
            key={address}
            address={address}
            {...getRadioProps({ value: index.toString() })}
          />
        ))}
      <Token {...getRadioProps({ value: "DEPLOY" })}>
        <Text>Deploy a new asset</Text>
      </Token>
    </Grid>
  )
}

export default TokenSelect
