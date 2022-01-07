import { Box, Flex, Img, SimpleGrid, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import useRoles from "components/start-airdrop/UploadNFTs/hooks/useRoles"
import useIsGroupMember from "components/[drop]/ClaimCard/components/TelegramClaimButton/hooks/useIsGroupMember"
import useDropIcon from "components/[drop]/hooks/useDropIcon/useDropIcon"
import { DropWithRoles } from "contract_interactions/getDropRolesData"
import { motion } from "framer-motion"
import { useMemo } from "react"

type Props = {
  drop: DropWithRoles
}

const DropCard = ({ drop }: Props): JSX.Element => {
  // const dropData = useDropWithRoles(drop.urlName, drop)
  const icon = useDropIcon(drop.serverId, drop.communityImage, drop.platform)
  const roles = useRoles(
    drop.serverId,
    drop.platform,
    Object.fromEntries(
      Object.entries(drop.roles).map(([id, { name }]) => [id, name])
    )
  )

  const isGroupMember = useIsGroupMember(drop.serverId, drop.platform)

  const imageGrid = useMemo((): Array<{ imageHash: string; tokenName: string }> => {
    if (!drop?.roles || Object.entries(drop.roles).length === 0) return []

    return Object.values(drop.roles).map((roleData) => ({
      imageHash: roleData.image.split("/").pop(),
      tokenName: roleData.name,
    }))
  }, [drop])

  if (
    (drop.platform === "DISCORD" && Object.keys(roles ?? {}).length <= 0) ||
    (drop.platform === "TELEGRAM" && isGroupMember === null)
  )
    return null

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Link
        href={`/${drop.urlName}`}
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
              <Img src={icon} objectFit="cover" />
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
              {drop.dropName}
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
