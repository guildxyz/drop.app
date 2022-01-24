import { Tag, Text, Tooltip } from "@chakra-ui/react"
import { useDrop } from "../DropProvider"
import useDropBalance from "./hooks/useDropBalance"
import useTokenSymbol from "./hooks/useTokenSymbol"

const DropBalance = () => {
  const { tokenAddress } = useDrop()
  const symbol = useTokenSymbol(tokenAddress)
  const balance = useDropBalance()

  return (
    <>
      <Text>Current supply:</Text>
      <Text fontWeight="semibold">
        {balance ?? "..."} {symbol || "SYMBL"}
      </Text>
    </>
  )

  return (
    <Tooltip label="Remaining claimable supply">
      <Tag variant="subtle">
        {balance ?? "..."} {symbol || "SYMBL"}
      </Tag>
    </Tooltip>
  )
}

export default DropBalance
