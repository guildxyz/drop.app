import { Alert, AlertIcon, Circle, Grid, HStack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import AuthenticateButton from "components/start-airdrop/SubmitButton/components/AuthenticateButton"
import ClaimCard from "components/[drop]/ClaimCard"
import DropBalance from "components/[drop]/DropBalance"
import DropProvider, { useDrop } from "components/[drop]/DropProvider"
import ERC20Claim from "components/[drop]/ERC20Claim"
import DropSettingsMenu from "components/[drop]/ERC20Claim/components/DropSettingsMenu"
import { Chains, RPC } from "connectors"
import getDropRolesData, {
  DropWithRoles,
} from "contract_interactions/getDropRolesData"
import getDropUrlNames from "contract_interactions/getDropUrlNames"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { ReactElement, useMemo } from "react"
import shortenHex from "utils/shortenHex"

type Props = {
  drop: DropWithRoles
}

const WrappedDropPage = ({ drop }: Props): ReactElement => (
  <DropProvider drop={drop}>
    <DropPage />
  </DropProvider>
)

const DropPage = () => {
  const { account } = useWeb3React()
  const {
    roles,
    tokenAddress,
    dropName,
    platform,
    communityImage,
    communityName,
    hasAccess,
    dropContractType,
    ownerAddress,
  } = useDrop()

  const isOwner = ownerAddress === account

  const isAuthenticated = useIsAuthenticated(platform)

  // Not using useCallback here, since there is a possible 'null' return value, indicating no alert message
  const dropAlert = useMemo(() => {
    if (!hasAccess)
      return `It's no longer possible to claim in this drop, since the bot has been kicked from the ${
        platform === "DISCORD" ? "server" : "group"
      }`
    if (platform === "DISCORD" && Object.keys(roles ?? {}).length <= 0)
      return "It's no longer possible to claim in this drop, since the roles associated with this drop have been deleted on this server or there are no active roles"
    return null
  }, [hasAccess, platform, roles])

  return (
    <Layout title={dropName}>
      <HStack justifyContent="space-between" alignItems="center">
        <HStack spacing={20}>
          <HStack spacing={5}>
            {communityImage?.length > 0 && (
              <Circle overflow="hidden" bgColor="gray.300">
                <Image
                  src={communityImage}
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

        {dropContractType === "ERC20" && (
          <HStack>
            <DropBalance />{" "}
            {isOwner && platform === "DISCORD" && <DropSettingsMenu />}
          </HStack>
        )}
        {isAuthenticated === false && (
          <AuthenticateButton platform={platform} size="sm" />
        )}
      </HStack>

      {dropAlert === null ? (
        dropContractType === "NFT" ? (
          <Grid mt={20} gridTemplateColumns="repeat(3, 1fr)" gap={5}>
            {Object.entries(roles).map(([roleId, role]) => (
              <ClaimCard roleId={roleId} role={role} key={roleId} />
            ))}
          </Grid>
        ) : (
          <ERC20Claim />
        )
      ) : (
        <Alert mt={10} status="info" alignItems="center">
          <AlertIcon />
          {dropAlert}
        </Alert>
      )}
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
export default WrappedDropPage
