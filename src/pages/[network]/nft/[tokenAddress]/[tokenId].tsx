import { Text } from "@chakra-ui/react"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import Layout from "components/common/Layout"
import { RPC, supportedChains } from "connectors"
import { TokenURI } from "hooks/roletoken/useRoleToken"
import { GetServerSideProps } from "next"
import { ReactElement } from "react"
import ROLE_TOKEN_ABI from "static/abis/roletoken.json"

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
    const { tokenAddress, tokenId, network: networkParam } = params
    const network = (networkParam as string).toUpperCase()
    if (!supportedChains.includes(network)) throw new Error() // gets caught, returns 404

    const tokenContract = new Contract(
      tokenAddress as string,
      ROLE_TOKEN_ABI,
      new JsonRpcProvider(RPC[network].rpcUrls[0])
    )
    const uri = await tokenContract.tokenURI(tokenId)
    const header = "data:application/json;base64,"
    const data = uri.substring(header.length, uri.length)
    const buffer = Buffer.from(data, "base64")
    const tokenURI = JSON.parse(buffer.toString())
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
