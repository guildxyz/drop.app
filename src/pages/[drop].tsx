import { Circle, Grid, HStack, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import AuthenticateButton from "components/start-airdrop/SubmitButton/components/AuthenticateButton"
import ClaimCard from "components/[drop]/ClaimCard"
import { Chains, RPC } from "connectors"
import getDropRolesData, {
  DropWithRoles,
} from "contract_interactions/getDropRolesData"
import getDropUrlNames from "contract_interactions/getDropUrlNames"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import useServerData from "hooks/useServerData"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { ReactElement } from "react"
import shortenHex from "utils/shortenHex"

type Props = {
  drop: DropWithRoles
  urlName: string
}

const DropPage = ({
  urlName,
  drop: { roles, tokenAddress, dropName, serverId, platform },
}: Props): ReactElement => {
  const { name: serverName, id, icon } = useServerData(serverId)
  const isAuthenticated = useIsAuthenticated()

  return (
    <Layout title={dropName}>
      <HStack justifyContent="space-between">
        <HStack spacing={20}>
          <HStack spacing={5}>
            {icon?.length > 0 && (
              <Circle overflow="hidden">
                <Image
                  src={`https://cdn.discordapp.com/icons/${id}/${icon}`}
                  alt={`Icon of ${serverName} sever`}
                  width={40}
                  height={40}
                />
              </Circle>
            )}
            <Text>{serverName}</Text>
          </HStack>

          <HStack>
            <Text>Contract address:</Text>
            <Link
              target="_blank"
              colorScheme="yellow"
              href={`${
                RPC[process.env.NEXT_PUBLIC_CHAIN].blockExplorerUrls[0]
              }address/${tokenAddress}`}
            >
              {shortenHex(tokenAddress)}
            </Link>
          </HStack>
        </HStack>

        {isAuthenticated === false && <AuthenticateButton size="sm" />}
      </HStack>

      <Grid mt={20} gridTemplateColumns="repeat(3, 1fr)" gap={5}>
        {Object.entries(roles).map(([roleId, role]) => (
          <ClaimCard
            platform={platform}
            roleId={roleId}
            role={role}
            key={roleId}
            tokenAddress={tokenAddress}
            serverId={serverId}
            urlName={urlName}
          />
        ))}
      </Grid>
    </Layout>
  )
}

const getStaticProps: GetStaticProps = async ({ params }) => {
  const { drop: urlName } = params

  try {
    const drop = await getDropRolesData(
      Chains[process.env.NEXT_PUBLIC_CHAIN],
      urlName as string
    )

    if (!drop) throw Error()

    return {
      props: { urlName, drop },
      revalidate: 10,
    }
  } catch {
    return {
      notFound: true,
      revalidate: 10,
    }
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const urlNames = await getDropUrlNames(Chains[process.env.NEXT_PUBLIC_CHAIN])

  const paths = urlNames
    .filter((urlName) => urlName.length > 0)
    .map((drop) => ({
      params: { drop },
    }))

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticProps, getStaticPaths }
export default DropPage
