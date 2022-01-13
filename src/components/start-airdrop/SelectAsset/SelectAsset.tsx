import { Grid, Text, useRadioGroup } from "@chakra-ui/react"
import RadioButton from "components/start-airdrop/SelectAsset/components/RadioButton"
import { ReactElement } from "react"
import { useController } from "react-hook-form"

const assetRadioData = [
  {
    value: "NFT",
    displayText: "NFT",
  },
  {
    value: "TOKEN",
    displayText: "Token",
  },
]

const SelectAsset = (): ReactElement => {
  const { field } = useController({
    name: "assetType",
  })

  const { getRadioProps, getRootProps } = useRadioGroup({
    onChange: field.onChange,
    value: field.value,
  })

  return (
    <Grid gridTemplateColumns="1fr" gap={10}>
      <Grid gridTemplateColumns="repeat(4, 1fr)" gap={5} {...getRootProps()}>
        {assetRadioData.map(({ value, displayText }) => (
          <RadioButton key={value} {...getRadioProps({ value })}>
            <Text fontWeight="medium">{displayText}</Text>
          </RadioButton>
        ))}
      </Grid>
    </Grid>
  )
}

export default SelectAsset
