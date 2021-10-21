import { Button, Center, Grid } from "@chakra-ui/react"
import useDeployTokenMachine from "hooks/useDeployTokenMachine"
import { ReactElement, useEffect } from "react"
import { useWatch } from "react-hook-form"
import InputNFT from "./components/InputNFT"

const Asset = (): ReactElement => {
  const assetData = useWatch({
    name: "assetData",
    defaultValue: { name: "", symbol: "" },
  })
  const { onSubmit, isLoading, isSuccess, state } = useDeployTokenMachine()

  useEffect(() => console.log(state), [state])

  return (
    <Grid gridTemplateColumns="1fr" gap={10}>
      <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5}>
        <InputNFT />
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
