import { Button, useColorMode } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = Record<string, any>

const AccountButton = ({
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Button
      flexGrow={1}
      borderRadius="2xl"
      bg={colorMode === "light" ? "gray.100" : "blackAlpha.300"}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default AccountButton
