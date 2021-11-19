import { Button, Img, Input, VStack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import DropCard from "components/index/DropCard"
import { Chains } from "connectors"
import { DropWithRoles } from "contract_interactions/getDropRolesData"
import getDrops from "contract_interactions/getDrops"
import { motion } from "framer-motion"
import useDrops from "hooks/airdrop/useDrops"
import useServersOfUser from "hooks/discord/useServersOfUser"
import { GetStaticProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"

type Props = {
  drops: DropWithRoles[]
}

const Page = ({ drops: initialDrops }: Props): JSX.Element => {
  const router = useRouter()
  const serverId = router.query.serverId as string
  const [searchInput, setSeacrhInput] = useState<string>(
    serverId?.length > 0 ? `server:${serverId}` : ""
  )

  const serversOfUser = useServersOfUser()

  const drops = useDrops(initialDrops)

  const [yourDrops, allDrops] = useMemo(
    () =>
      drops.reduce(
        (acc, airdrop) => {
          if (serversOfUser?.includes(airdrop.serverId)) {
            acc[0].push(airdrop)
          } else {
            acc[1].push(airdrop)
          }
          return acc
        },
        [[], []]
      ),
    [drops, serversOfUser]
  )

  const [filteredYourDrops, filteredAllDrops] = useMemo(
    () =>
      [yourDrops, allDrops].map((_) =>
        _.filter(({ dropName, serverId: server }) => {
          if (/^server:[0-9]{18}$/.test(searchInput.trim()))
            return server === searchInput.trim().slice(7)
          return new RegExp(searchInput.toLowerCase()).test(dropName?.toLowerCase())
        })
      ),
    [yourDrops, allDrops, searchInput]
  )

  return (
    <Layout title="Drop app" imageUrl="/logo.png">
      <VStack alignItems="left" spacing={10}>
        <Input
          value={searchInput}
          onChange={({ target: { value } }) => setSeacrhInput(value)}
          maxW="lg"
          type="text"
          placeholder="Search drops"
        />
        <CategorySection
          title="Your drops"
          fallbackText={`No results for ${searchInput}`}
        >
          {filteredYourDrops?.length ? (
            filteredYourDrops
              .map((drop) => <DropCard key={drop.id} drop={drop} />)
              .concat(
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Link href="/start-airdrop" passHref>
                    <Button
                      width="full"
                      height="full"
                      minHeight={20}
                      colorScheme="red"
                      variant="outline"
                      leftIcon={<Img src="/new.png" boxSize={8} />}
                      aria-label="Start a new airdrop"
                    >
                      New drop
                    </Button>
                  </Link>
                </motion.div>
              )
          ) : (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link href="/start-airdrop" passHref>
                <Button
                  width="full"
                  height="full"
                  minHeight={20}
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<Img src="/new.png" boxSize={8} />}
                  aria-label="Start a new airdrop"
                >
                  New drop
                </Button>
              </Link>
            </motion.div>
          )}
        </CategorySection>
        <CategorySection
          title="All drops"
          fallbackText={
            drops?.length
              ? `No results for ${searchInput}`
              : "Can't fetch drops right now. Check back later!"
          }
        >
          {filteredAllDrops.length &&
            filteredAllDrops?.map((drop) => <DropCard key={drop.id} drop={drop} />)}
        </CategorySection>
      </VStack>
    </Layout>
  )
}

const getStaticProps: GetStaticProps = async () => {
  const drops = await getDrops(Chains[process.env.NEXT_PUBLIC_CHAIN])
  return {
    props: { drops },
    revalidate: 10_000,
  }
}

export { getStaticProps }
export default Page
