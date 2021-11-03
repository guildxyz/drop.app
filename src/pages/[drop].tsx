import { Circle, Grid, HStack, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import AuthenticateButton from "components/start-airdrop/SubmitButton/components/AuthenticateButton"
import ClaimCard from "components/[drop]/ClaimCard"
import { Drop } from "hooks/airdrop/useAirdrop"
import useDrop from "hooks/airdrop/useDrop"
import useIsAuthenticated from "hooks/discord/useIsAuthenticated"
import useServerData from "hooks/discord/useServerData"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { ReactElement } from "react"
import shortenHex from "utils/shortenHex"

const DropPage = (props: Drop): ReactElement => {
  const drop = useDrop(props.name, props)
  const { name, id, icon } = useServerData(drop.serverId)
  const isAuthenticated = useIsAuthenticated()

  /* const { stopAirdrop } = useAirdrop()
  useEffect(() => {
    console.log({
      serverId: drop.serverId,
      roleId: drop.roleIds[0],
      tokenAddress: drop.,
    })
    stopAirdrop(drop.serverId, drop.roleIds[0], drop.tokenAddress)()
      .then(() => console.log("stopped"))
      .catch((e) => console.log(e))
  }, []) */

  return (
    <Layout title={drop.name}>
      <HStack justifyContent="space-between">
        <HStack spacing={20}>
          <HStack spacing={5}>
            {icon?.length > 0 && (
              <Circle overflow="hidden">
                <Image
                  src={`https://cdn.discordapp.com/icons/${id}/${icon}`}
                  alt={`Icon of ${name} sever`}
                  width={40}
                  height={40}
                />
              </Circle>
            )}
            <Text>{name}</Text>
          </HStack>

          <HStack>
            <Text>Contract address:</Text>
            <Link
              target="_blank"
              colorScheme="purple"
              href={`https://goerli.etherscan.io/address/${drop.tokenAddress}`}
            >
              {shortenHex(drop.tokenAddress)}
            </Link>
          </HStack>
        </HStack>

        {!isAuthenticated && <AuthenticateButton size="sm" />}
      </HStack>

      {drop.roleIds && (
        <Grid mt={20} gridTemplateColumns="repeat(3, 1fr)" gap={5}>
          {drop.roleIds.map((roleId) => (
            <ClaimCard roleId={roleId} key={roleId} drop={drop} />
          ))}
        </Grid>
      )}
    </Layout>
  )
}

const getStaticProps: GetStaticProps = async ({ params }) => {
  const { drop } = params
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/drop/${drop}`)

  if (!response.ok)
    return {
      notFound: true,
    }

  const dropData = await response.json()

  return {
    props: {
      serverId: dropData[0],
      roleIds: dropData[1],
      tokenAddress: dropData[2],
      name: dropData.name,
      id: dropData.id,
    },
    revalidate: 10_000,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/drop/allIds`)
  const dropIds = await response.json()
  return {
    paths: dropIds.map((id: string) => ({ params: { drop: id } })),
    fallback: "blocking",
  }
}

export { getStaticProps, getStaticPaths }
export default DropPage
