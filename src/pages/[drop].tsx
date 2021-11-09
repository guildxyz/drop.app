import { Circle, Grid, HStack, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import AuthenticateButton from "components/start-airdrop/SubmitButton/components/AuthenticateButton"
import ClaimCard from "components/[drop]/ClaimCard"
import { Chains } from "connectors"
import airdropContracts from "contracts"
import getDropUrlNames from "contract_interactions/getDropUrlNames"
import { Drop } from "contract_interactions/types"
import useDrop from "hooks/airdrop/useDrop"
import useIsAuthenticated from "hooks/discord/useIsAuthenticated"
import useServerData from "hooks/discord/useServerData"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { ReactElement } from "react"
import shortenHex from "utils/shortenHex"

const DropPage = (props: Drop): ReactElement => {
  const drop = useDrop(props.urlName, props)
  const { name, id, icon } = useServerData(drop.serverId)
  const isAuthenticated = useIsAuthenticated()

  return (
    <Layout title={drop.dropName}>
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
  const { drop: urlName } = params

  try {
    const dropData = await airdropContracts[
      process.env.NEXT_PUBLIC_CHAIN
    ].getDataOfDrop(urlName)

    if (!dropData) throw Error()

    const { 0: dropName, 1: serverId, 2: roleIds, 3: tokenAddress } = dropData

    return {
      props: {
        serverId,
        roleIds,
        tokenAddress,
        urlName,
        dropName,
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
  const urlNames = await getDropUrlNames(Chains[process.env.NEXT_PUBLIC_CHAIN])

  const paths = urlNames.map((drop) => ({
    params: { drop },
  }))

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticProps, getStaticPaths }
export default DropPage
