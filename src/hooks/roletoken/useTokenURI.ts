import useSWR from "swr"
import useRoleToken, { TokenURI } from "./useRoleToken"

const getTokenURI = (
  _: string,
  tokenURI: (tokenId: number) => Promise<TokenURI>,
  tokenId: number
) => tokenURI(tokenId)

const useTokenURI = (tokenAddress: string, tokenId: number): TokenURI => {
  const { tokenURI } = useRoleToken(tokenAddress)

  const shouldFetch = !!tokenURI

  const { data } = useSWR(
    shouldFetch ? ["tokenURI", tokenURI, tokenId] : null,
    getTokenURI
  )

  return data
}

export default useTokenURI
