import { Circle, Grid, HStack, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import AuthenticateButton from "components/start-airdrop/SubmitButton/components/AuthenticateButton"
import ClaimCard from "components/[drop]/ClaimCard"
import DropProvider from "components/[drop]/DropProvider"
import useCommunityName from "components/[drop]/hooks/useCommunityName"
import { Chains, RPC } from "connectors"
import getDropRolesData, {
  DropWithRoles,
} from "contract_interactions/getDropRolesData"
import getDropUrlNames from "contract_interactions/getDropUrlNames"
import useDropIcon from "hooks/useDropIcon"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { ReactElement } from "react"
import shortenHex from "utils/shortenHex"

type Props = {
  drop: DropWithRoles
}

const DropPage = ({ drop }: Props): ReactElement => {
  const { roles, tokenAddress, dropName, serverId, platform, platformImage } = drop

  const communityName = useCommunityName(serverId, platform)
  const isAuthenticated = useIsAuthenticated(platform)
  const icon = useDropIcon(serverId, platformImage, platform)

  return (
    <Layout title={dropName}>
      <DropProvider drop={drop}>
        <HStack justifyContent="space-between">
          <HStack spacing={20}>
            <HStack spacing={5}>
              {icon?.length > 0 && (
                <Circle overflow="hidden">
                  <Image
                    src={icon}
                    alt={`Icon of ${communityName} sever`}
                    width={40}
                    height={40}
                  />
                </Circle>
              )}
              <Text>{communityName}</Text>
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
            <ClaimCard roleId={roleId} role={role} key={roleId} />
          ))}
        </Grid>
      </DropProvider>
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
      props: { drop },
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
