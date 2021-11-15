import { Button, Grid, useRadioGroup } from "@chakra-ui/react"
import { ReactElement } from "react"
import { useController } from "react-hook-form"
import InputNFT from "./components/InputNFT"

const Asset = (): ReactElement => {
  const { field } = useController({
    name: "assetType",
  })

  const { getRadioProps, getRootProps } = useRadioGroup({
    onChange: field.onChange,
    value: field.value,
  })

  return (
    <Grid gridTemplateColumns="1fr" gap={10}>
      <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5} {...getRootProps()}>
        <InputNFT {...getRadioProps({ value: "NFT" })} />
        <Button colorScheme="darkerGray" disabled>
          Token
        </Button>
        <Button colorScheme="darkerGray" disabled>
          ERC 1155
        </Button>
      </Grid>
    </Grid>
  )
}

export default Asset
