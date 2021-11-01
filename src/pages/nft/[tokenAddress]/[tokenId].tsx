import { Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import useTokenURI from "hooks/roletoken/useTokenURI"
import { GetServerSideProps } from "next"

type Props = {
  tokenAddress: string
  tokenId: number
}

const NFTPage = ({ tokenAddress, tokenId }: Props) => {
  const tokenURI = useTokenURI(tokenAddress, tokenId)

  return (
    <Layout title={tokenURI?.name}>
      <Text as="pre">{JSON.stringify(tokenURI, null, 2)}</Text>
    </Layout>
  )
}

const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { tokenAddress, tokenId } = params

  return {
    props: {
      tokenAddress: tokenAddress as string,
      tokenId: +(tokenId as string),
    },
  }
}

/* const getStaticProps: GetStaticProps = ({ params }) => {
  const { tokenAddress, tokenId } = params

  return {
    props: { tokenAddress, tokenId },
  }
}

const getStaticPaths: GetStaticPaths = () => {

} */

export { getServerSideProps }
export default NFTPage
