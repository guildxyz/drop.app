import { Button, Center, Grid, useRadioGroup } from "@chakra-ui/react"
import useDeployTokenMachine from "hooks/useDeployTokenMachine"
import { ReactElement } from "react"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import InputNFT from "./components/InputNFT"

const Asset = ({ field }): ReactElement => {
  const startFormMethods = useFormContext()
  const methods = useForm({ mode: "all" })
  const assetData = useWatch({
    name: "assetData",
    defaultValue: { name: "", symbol: "" },
    control: methods.control,
  })

  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: "NFT",
    onChange: field.onChange,
    value: field.value,
  })

  const { onSubmit, isLoading, isSuccess } = useDeployTokenMachine()

  return (
    <Grid gridTemplateColumns="1fr" gap={10}>
      <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5} {...getRootProps()}>
        <InputNFT {...getRadioProps({ value: "NFT" })} />
        <Button disabled>Token</Button>
        <Button disabled>ERC 1155</Button>
      </Grid>
      <Center>
        <Button
          onClick={() => onSubmit(assetData)}
          isLoading={isLoading}
          isDisabled={
            isSuccess || assetData.name.length <= 0 || assetData.symbol.length <= 0
          }
          colorScheme="purple"
        >
          Deploy
        </Button>
      </Center>
    </Grid>
  )
}

export default Asset
