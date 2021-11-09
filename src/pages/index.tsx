import { Button, Center, Grid, Input, Text, VStack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import { Chains } from "connectors"
import getDrops from "contract_interactions/getDrops"
import { Drop } from "contract_interactions/types"
import useDrops from "hooks/airdrop/useDrops"
import useServersOfUser from "hooks/discord/useServersOfUser"
import { GetStaticProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { Plus } from "phosphor-react"
import { useMemo, useState } from "react"

type Props = {
  drops: Drop[]
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
      drops
        ? drops.reduce(
            (acc, airdrop) => {
              if (serversOfUser?.includes(airdrop.serverId)) {
                acc[0].push(airdrop)
              } else {
                acc[1].push(airdrop)
              }
              return acc
            },
            [[], []]
          )
        : [[], []],
    [drops, serversOfUser]
  )

  const [filteredYourDrops, filteredAllDrops] = useMemo(
    () =>
      [yourDrops, allDrops].map((_) =>
        _.filter(({ name, serverId: server }) => {
          if (/^server:[0-9]{18}$/.test(searchInput.trim()))
            return server === searchInput.trim().slice(7)
          return new RegExp(searchInput).test(name)
        })
      ),
    [yourDrops, allDrops, searchInput]
  )

  return (
    <Layout title="Drop app">
      <VStack alignItems="left" spacing={10}>
        <Input
          value={searchInput}
          onChange={({ target: { value } }) => setSeacrhInput(value)}
          maxW="lg"
          type="text"
          placeholder="Search drops"
        />
        <Section title="Your drops">
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5}>
            {filteredYourDrops.map(({ dropName, id, urlName }) => (
              <Link key={id} href={`/${urlName}`} passHref>
                <Center
                  backgroundColor="primary.100"
                  borderWidth="1px"
                  borderRadius="lg"
                  padding={10}
                  transition="background-color .2s linear, border-color .2s linear"
                  _hover={{
                    cursor: "pointer",
                    backgroundColor: "purple.300",
                    borderColor: "purple.400",
                  }}
                >
                  <Text fontSize="xl">{dropName}</Text>
                </Center>
              </Link>
            ))}
            <Link href="/start-airdrop" passHref>
              <Button
                height="full"
                minHeight={20}
                colorScheme="purple"
                variant="outline"
                leftIcon={
                  <Plus
                    size={20}
                    weight="light"
                    color="var(--chakra-colors-purple-300)"
                  />
                }
                aria-label="Start a new airdrop"
              >
                New drop
              </Button>
            </Link>
          </Grid>
        </Section>
        {filteredAllDrops?.length > 0 && (
          <Section title="All drops">
            <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5}>
              {filteredAllDrops.map(({ id, dropName, urlName }) => (
                <Link key={id} href={`/${urlName}`} passHref>
                  <Center
                    backgroundColor="primary.100"
                    borderWidth="1px"
                    borderRadius="lg"
                    padding={10}
                    transition="background-color .2s linear, border-color .2s linear"
                    _hover={{
                      cursor: "pointer",
                      backgroundColor: "purple.300",
                      borderColor: "purple.400",
                    }}
                  >
                    <Text fontSize="xl">{dropName}</Text>
                  </Center>
                </Link>
              ))}
            </Grid>
          </Section>
        )}
      </VStack>
    </Layout>
  )
}

const getStaticProps: GetStaticProps = async () => {
  const drops = await getDrops(Chains[process.env.NEXT_PUBLIC_CHAIN])
  console.log(drops)
  return { props: { drops } }
}

export { getStaticProps }
export default Page
