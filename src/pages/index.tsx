import { Alert, AlertIcon, Button, Grid, Input, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import DropCard from "components/index/DropCard"
import useDrops from "hooks/airdrop/useDrops"
import useServersOfUser from "hooks/discord/useServersOfUser"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { Plus } from "phosphor-react"
import { useMemo, useState } from "react"

type Props = {
  serverId?: string
}

const Page = ({ serverId }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const [searchInput, setSeacrhInput] = useState<string>(
    serverId?.length > 0 ? `server:${serverId}` : ""
  )

  const serversOfUser = useServersOfUser()

  const drops = useDrops()

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

  if (!account)
    return (
      <Layout title="Drop to your community" imageUrl="/logo.png">
        <Alert status="error">
          <AlertIcon />
          Please connect your wallet to continue
        </Alert>
      </Layout>
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
        <Section title="Your drops">
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5}>
            {filteredYourDrops.map(({ name, id }) => (
              <DropCard key={id} id={id} name={name} />
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
              {filteredAllDrops.map(({ id, name }) => (
                <DropCard key={id} id={id} name={name} />
              ))}
            </Grid>
          </Section>
        )}
      </VStack>
    </Layout>
  )
}

const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    serverId: query.serverId ? (query.serverId as string) : null,
  },
})

export { getServerSideProps }
export default Page
