import { Box, Flex, Img, SimpleGrid, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { Drop } from "contract_interactions/types"
import { motion } from "framer-motion"
import useDropWithRoles from "hooks/airdrop/useDropWithRoles"
import useServerData from "hooks/discord/useServerData"
import { useMemo } from "react"

type Props = {
  drop: Drop
}

const DropCard = ({ drop }: Props): JSX.Element => {
  const { id, icon } = useServerData(drop?.serverId)
  const dropData = useDropWithRoles(drop?.urlName)

  const imageGrid = useMemo((): Array<{ imageHash: string; tokenName: string }> => {
    if (!dropData?.roles || Object.entries(dropData.roles).length === 0) return []

    return Object.values(dropData.roles).map((roleData) => ({
      imageHash: roleData.imageHash,
      tokenName: roleData.tokenName,
    }))
  }, [dropData])

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Link
        href={`/${drop?.urlName}`}
        borderRadius="2xl"
        w="full"
        _hover={{ textDecor: "none" }}
      >
        <Card role="group" w="full" h="full" bg="white" justifyContent="center">
          <Flex
            position="relative"
            alignItems="center"
            justifyContent="center"
            height={28}
            bgColor="gray.300"
            overflow="hidden"
          >
            <SimpleGrid
              position="absolute"
              top={0}
              left={0}
              width="full"
              gridTemplateColumns={`repeat(${imageGrid.length}, 1fr)`}
              gap={0}
            >
              {imageGrid.map((role, i) => (
                <Flex key={i} width="full" height={imageGrid.length <= 3 ? 28 : 14}>
                  <Img
                    src={`https://ipfs.fleek.co/ipfs/${role.imageHash}`}
                    alt={`Image of ${role.tokenName} role`}
                    width="full"
                    height="full"
                    objectFit="cover"
                  />
                </Flex>
              ))}
            </SimpleGrid>
          </Flex>
          <SimpleGrid
            position="relative"
            mt={-16}
            px={{ base: 5, sm: 6 }}
            py="7"
            gridTemplateColumns="5rem 1fr"
            gap={4}
          >
            <Box
              boxSize={20}
              bgColor="gray.300"
              rounded="full"
              borderWidth={4}
              borderColor="white"
              overflow="hidden"
            >
              <Img
                src={
                  icon
                    ? `https://cdn.discordapp.com/icons/${id}/${icon}`
                    : "/svg/discord-logo.svg"
                }
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
              {drop?.dropName}
            </Text>

            {/* <GridItem colSpan={2}>
              <Wrap>
                <Tag>Sample tag</Tag>
              </Wrap>
            </GridItem> */}
          </SimpleGrid>
        </Card>
      </Link>
    </motion.div>
  )
}

export default DropCard
