import { Circle, Grid, HStack, Text } from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import AuthenticateButton from "components/start-airdrop/SubmitButton/components/AuthenticateButton"
import ClaimCard from "components/[drop]/ClaimCard"
import { supportedChains } from "connectors"
import airdropContracts from "contracts"
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
  const { drop: id, network: networkParam } = params
  const network = (networkParam as string).toUpperCase()

  if (!supportedChains.includes(network))
    return {
      notFound: true,
    }

  try {
    const name = await airdropContracts[network].dropnamesById(id)

    if (name?.length <= 0) throw new Error() // Gets caught, returns 404

    const {
      0: serverId,
      1: roleIds,
      2: tokenAddress,
    } = await airdropContracts[network].getDataOfDrop(name)

    return {
      props: {
        serverId,
        roleIds,
        tokenAddress,
        name,
        id,
      },
      revalidate: 10_000,
    }
  } catch {
    return {
      notFound: true,
    }
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const paths = await Promise.all(
    supportedChains.map((network) =>
      airdropContracts[network].numOfDrops().then((_: BigNumber) => +_)
    )
  ).then((counts) =>
    counts.reduce((acc, count, index) => {
      ;[...Array(count)]
        .map((_, i) => i.toString())
        .forEach((id) =>
          acc.push({
            params: { drop: id, network: supportedChains[index].toLowerCase() },
          })
        )
      return acc
    }, [])
  )

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticProps, getStaticPaths }
export default DropPage
