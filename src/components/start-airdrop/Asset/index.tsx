import { Button, Center, Grid, useRadioGroup } from "@chakra-ui/react"
import useDeployTokenMachine from "hooks/machines/useDeployTokenMachine"
import { ReactElement } from "react"
import { useController, useWatch } from "react-hook-form"
import InputNFT from "./components/InputNFT"

/*
  {
    assetType: "NFT"
    assetData: {
      nft: {
        name: string
        symbol: string
      },
      token: ...
      erc1155
    }
  }
*/

const Asset = (): ReactElement => {
  const { field } = useController({
    defaultValue: "NFT",
    name: "assetType",
  })

  const assetData = useWatch({
    name: "assetData",
    defaultValue: { name: "", symbol: "" },
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
