import { Center, Text } from "@chakra-ui/react"
import Link from "components/common/Link"

type Props = {
  id: number
  name: string
}

const DropCard = ({ id, name }: Props): JSX.Element => (
  <Link href={`/${id}`} _hover={{ textDecoration: "none" }} passHref>
    <Center
      backgroundColor="primary.100"
      borderWidth="1px"
      borderRadius="lg"
      padding={10}
      width="full"
      transition="background-color .2s linear, border-color .2s linear"
      _hover={{
        cursor: "pointer",
        backgroundColor: "purple.300",
        borderColor: "purple.400",
      }}
    >
      <Text fontSize="xl">{name}</Text>
    </Center>
  </Link>
)

export default DropCard
