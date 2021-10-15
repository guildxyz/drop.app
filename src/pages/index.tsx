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
import Link from "next/link"
import { useMemo, useState } from "react"

const sampleAirdropsData = [
  {
    name: "test airdrop 1",
    serverId: "896407363169435658", // teszt 4 server
    roles: ["896407522649444372", "896407568434475008", "896407596767010828"],
  },
  {
    name: "test airdrop 2",
    serverId: "893231464739635220",
    roles: ["235245", "34535", "3453"],
  },
  {
    name: "test airdrop 3",
    serverId: "32475213948723694524",
    roles: ["3254234627", "546756889", "12348578"],
  },
  {
    name: "test airdrop 4",
    serverId: "26245687459357",
    roles: ["4653737", "4589", "56785678463"],
  },
]

const Page = (): JSX.Element => {
  const { account } = useWeb3React()
  const [searchInput, setSeacrhInput] = useState<string>("")

  const serversOfUser = useServersOfUser()

  const [yourDrops, allDrops] = useMemo(
    () =>
      sampleAirdropsData.reduce(
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
    [sampleAirdropsData, serversOfUser]
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

export default Page
