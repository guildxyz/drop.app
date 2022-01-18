import { Tag, Tooltip } from "@chakra-ui/react"
import { useDrop } from "../DropProvider"
import useContractBalance from "./hooks/useContractBalance"
import useTokenSymbol from "./hooks/useTokenSymbol"

const DropBalance = () => {
  const { tokenAddress } = useDrop()
  const symbol = useTokenSymbol(tokenAddress)
  const balance = useContractBalance()

  return (
    <Tooltip label="Remaining claimable supply">
      <Tag variant="subtle">
        {balance ?? "..."} {symbol || "SYMBL"}
      </Tag>
    </Tooltip>
  )
}

export default DropBalance
