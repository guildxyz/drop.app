import { Box, Button, Grid } from "@chakra-ui/react"
import { ReactElement } from "react"
import InputNFT from "./components/InputNFT"

const Asset = (): ReactElement => (
  <Box>
    <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5}>
      <InputNFT />
      <Button disabled>Token</Button>
      <Button disabled>ERC 1155</Button>
    </Grid>
  </Box>
)

export default Asset
