import {
  FormControl,
  FormErrorMessage,
  Grid,
  Text,
  useRadioGroup,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useDeployedTokens from "hooks/airdrop/useDeployedTokens"
import { ReactElement, useEffect } from "react"
import {
  useController,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import Token from "./components/Token"

const TokenSelect = (): ReactElement => {
  const deployedTokens = useDeployedTokens()
  const { setValue } = useFormContext()
  const { account } = useWeb3React()
  const { errors } = useFormState()
  const contractId = useWatch({ name: "contractId" })

  useEffect(() => {
    if (contractId !== "DEPLOY") setValue("contractId", "")
  }, [account, setValue])

  const { field } = useController({
    name: "contractId",
    rules: {
      validate: (value) => {
        // if (value === "DEPLOY") return "You need to complete the deployment"
        return value.length > 0 || "You must pick a token"
      },
    },
  })

  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: "",
    onChange: field.onChange,
    value: field.value,
  })

  return (
    <FormControl isInvalid={errors.contractId?.message?.length > 0}>
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
      {errors.contractId?.message?.length > 0 && (
        <FormErrorMessage>{errors.contractId.message}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default TokenSelect
