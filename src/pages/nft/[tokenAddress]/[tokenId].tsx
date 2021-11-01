import { Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import { TokenURI } from "hooks/roletoken/useRoleToken"
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
  const { tokenAddress, tokenId } = params

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/token-uri/${tokenAddress}/${tokenId}`
  )

  if (!response.ok)
    return {
      notFound: true,
    }

  const tokenURI = await response.json()

  return {
    props: {
      tokenURI,
    },
  }
}

export { getServerSideProps }
export default NFTPage
