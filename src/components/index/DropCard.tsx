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

    const roles = Object.values(dropData.roles).map((roleData) => ({
      imageHash: roleData.imageHash,
      tokenName: roleData.tokenName,
    }))

    // In this case we'll display the 1-3 images next to each other
    if (roles.length <= 3) return roles

    // Otherwise we'll generate a grid, which contains 6 cols, and repeat the images if needed
    let repeatingRoles = [...roles]

    while (repeatingRoles.length < 18) {
      repeatingRoles = repeatingRoles.concat(repeatingRoles)
    }

    return repeatingRoles
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
              top={imageGrid.length <= 3 ? "-25%" : 0}
              left={0}
              width="full"
              gridTemplateColumns={
                imageGrid.length <= 3
                  ? `repeat(${imageGrid.length}, 1fr)`
                  : "repeat(6, 1fr)"
              }
              gap={0}
            >
              {imageGrid.map((role, i) => (
                <Flex
                  key={i}
                  width="full"
                  height={imageGrid.length <= 3 ? "auto" : 14}
                  bgColor=""
                >
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
