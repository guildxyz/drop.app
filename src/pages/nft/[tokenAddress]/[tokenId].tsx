import { Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import { Chains } from "connectors"
import getTokenURI, { TokenURI } from "contract_interactions/roletoken/getTokenURI"
import { GetServerSideProps } from "next"
import { ReactElement } from "react"

type Props = {
  tokenURI: TokenURI
}

const NFTPage = ({ tokenURI }: Props): ReactElement => (
  <Layout title={tokenURI.name}>
    <Text as="pre">{JSON.stringify(tokenURI, null, 2)}</Text>
  </Layout>
)

const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { tokenAddress, tokenId } = params
    const tokenURI = await getTokenURI(
      Chains[process.env.NEXT_PUBLIC_CHAIN],
      tokenAddress as string,
      +(tokenId as string)
    )

    return {
      props: {
        tokenURI,
      },
    }
  } catch {
    return {
      notFound: true,
    }
  }
}

export { getServerSideProps }
export default NFTPage
