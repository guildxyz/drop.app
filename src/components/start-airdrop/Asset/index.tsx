import { Button, Grid, useRadioGroup } from "@chakra-ui/react"
import { ReactElement } from "react"
import { useController } from "react-hook-form"
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

  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: "NFT",
    onChange: field.onChange,
    value: field.value,
  })

  return (
    <Grid gridTemplateColumns="1fr" gap={10}>
      <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5} {...getRootProps()}>
        <InputNFT {...getRadioProps({ value: "NFT" })} />
        <Button disabled>Token</Button>
        <Button disabled>ERC 1155</Button>
      </Grid>
    </Grid>
  )
}

export default Asset
