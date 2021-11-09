import { Box, GridItem, Img, SimpleGrid, Tag, Text, Wrap } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { Drop } from "contract_interactions/types"
import { motion } from "framer-motion"
import useRoles from "hooks/discord/useRoles"
import useServerData from "hooks/discord/useServerData"

type Props = {
  drop: Drop
}

const DropCard = ({ drop }: Props): JSX.Element => {
  const { id, icon } = useServerData(drop?.serverId)
  const roles = useRoles(id)

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Link
        href={`/${drop?.id}`}
        borderRadius="2xl"
        w="full"
        _hover={{ textDecor: "none" }}
      >
        <Card
          role="group"
          position="relative"
          w="full"
          h="full"
          bg="white"
          justifyContent="center"
        >
          <Box height={28} bgColor="gray.300" />
          <SimpleGrid
            mt={-16}
            px={{ base: 5, sm: 6 }}
            py="7"
            gridTemplateColumns="5rem 1fr"
            gap={4}
          >
            <Box
              boxSize={20}
              bgColor="gray.200"
              rounded="full"
              borderWidth={4}
              borderColor="white"
              overflow="hidden"
            >
              <Img
                src={`https://cdn.discordapp.com/icons/${id}/${icon}`}
                objectFit="cover"
              />
            </Box>
            <Text
              as="span"
              mt={11}
              fontFamily="display"
              fontWeight="bold"
              fontSize="xl"
              maxW="full"
              isTruncated
            >
              {drop?.name}
            </Text>

            <GridItem colSpan={2}>
              <Wrap>
                {roles &&
                  Object.entries(roles).map(([roleId, roleName]) => (
                    <Tag key={roleId}>{roleName}</Tag>
                  ))}
              </Wrap>
            </GridItem>
          </SimpleGrid>
        </Card>
      </Link>
    </motion.div>
  )
}

export default DropCard
