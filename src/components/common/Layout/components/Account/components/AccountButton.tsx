import { Button } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = Record<string, any>

const AccountButton = ({
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Button colorScheme="darkerGray" flexGrow={1} borderRadius="2xl" {...rest}>
    {children}
  </Button>
)

export default AccountButton
