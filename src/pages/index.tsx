import {
  Alert,
  AlertIcon,
  Center,
  Grid,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import useServersOfUser from "hooks/discord/useServersOfUser"
import useDrops from "hooks/useDrops"
import { GetServerSideProps } from "next"
import Link from "next/link"
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

  if (!account)
    return (
      <Layout title="Drop to your community">
        <Alert status="error">
          <AlertIcon />
          Please connect your wallet to continue
        </Alert>
      </Layout>
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
            {yourDrops
              .filter(({ name, serverId: server }) => {
                if (/^server:[0-9]{18}$/.test(searchInput.trim()))
                  return server === searchInput.trim().slice(7)
                return new RegExp(searchInput).test(name)
              })
              .map(({ name, id }) => (
                <Link key={id} href={`/${id}`} passHref>
                  <Center
                    backgroundColor="primary.700"
                    borderRadius="lg"
                    padding={10}
                    transition="background-color .2s linear"
                    _hover={{ cursor: "pointer", backgroundColor: "purple.500" }}
                  >
                    <Text fontSize="xl">{name}</Text>
                  </Center>
                </Link>
              ))}
          </Grid>
        </Section>
        <Section title="All drops">
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5}>
            {allDrops
              .filter(({ name }) => new RegExp(searchInput).test(name))
              .map(({ name }) => (
                <Link key={name} href={`/${name}`} passHref>
                  <Center
                    backgroundColor="primary.700"
                    borderRadius="lg"
                    padding={10}
                    transition="background-color .2s linear"
                    _hover={{ cursor: "pointer", backgroundColor: "purple.500" }}
                  >
                    <Text fontSize="xl">{name}</Text>
                  </Center>
                </Link>
              ))}
          </Grid>
        </Section>
      </VStack>
    </Layout>
  )
}

const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    serverId: query.serverId as string,
  },
})

export { getServerSideProps }
export default Page
