import { Button, Grid } from "@chakra-ui/react"

const Asset = () => (
  <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5}>
    <Button disabled>NFT</Button>
    <Button disabled>Token</Button>
    <Button disabled>ERC 1155</Button>
  </Grid>
)

export default Asset
