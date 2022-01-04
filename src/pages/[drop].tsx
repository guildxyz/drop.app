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
import useDropIcon from "hooks/useDropIcon"
import useGroupName from "hooks/useGroupName"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import useServerData from "hooks/useServerData"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { ReactElement, useEffect } from "react"
import shortenHex from "utils/shortenHex"

type Props = {
  drop: DropWithRoles
  urlName: string
}

const DropPage = ({
  urlName,
  drop: { roles, tokenAddress, dropName, serverId, platform, platformImage },
}: Props): ReactElement => {
  // TODO: Make one hook for all platforms similarly to useDropIcon
  const { name: serverName } = useServerData(serverId, platform)
  const groupName = useGroupName(serverId, platform)
  const isAuthenticated = useIsAuthenticated(platform)
  const icon = useDropIcon(serverId, platformImage, platform)

  useEffect(() => console.log(serverName, groupName), [serverName, groupName])

  return (
    <Layout title={dropName}>
      <HStack justifyContent="space-between">
        <HStack spacing={20}>
          <HStack spacing={5}>
            {icon?.length > 0 && (
              <Circle overflow="hidden">
                <Image
                  src={icon}
                  alt={`Icon of ${serverName ?? groupName ?? ""} sever`}
                  width={40}
                  height={40}
                />
              </Circle>
            )}
            <Text>{serverName ?? groupName ?? ""}</Text>
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
