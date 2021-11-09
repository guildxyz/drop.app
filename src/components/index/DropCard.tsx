import { Box, GridItem, SimpleGrid, Tag, Text, Wrap } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { motion } from "framer-motion"

type Props = {
  id: number
  name: string
}

const DropCard = ({ id, name }: Props): JSX.Element => (
  <motion.div whileTap={{ scale: 0.95 }}>
    <Link href={`/${id}`} borderRadius="2xl" w="full" _hover={{ textDecor: "none" }}>
      <Card
        role="group"
        position="relative"
        w="full"
        h="full"
        bg="white"
        justifyContent="center"
      >
        <Box height={28} bgColor="gray.400" />
        <SimpleGrid
          mt={-16}
          px={{ base: 5, sm: 6 }}
          py="7"
          gridTemplateColumns="5rem 1fr"
          gap={4}
        >
          <Box
            boxSize={20}
            bgColor="gray.400"
            rounded="full"
            borderWidth={4}
            borderColor="white"
          />
          <Text
            as="span"
            mt={11}
            fontFamily="display"
            fontWeight="bold"
            fontSize="xl"
            maxW="full"
            isTruncated
          >
            {name}
          </Text>

          <GridItem colSpan={2}>
            <Wrap>
              <Tag>This</Tag>
              <Tag>is a random</Tag>
              <Tag>tag</Tag>
            </Wrap>
          </GridItem>
        </SimpleGrid>
      </Card>
    </Link>
  </motion.div>
)

export default DropCard
