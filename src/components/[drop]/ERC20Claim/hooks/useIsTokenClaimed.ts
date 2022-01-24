import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import isClaimed from "contract_interactions/ERC20Drop/isClaimed"
import useUserId from "hooks/useUserId"
import useSWR from "swr"

const fetchIsTokenClaimed = (
  _: string,
  chainId: number,
  urlName: string,
  userId: string,
  roleId: string,
  provider: Provider
) => isClaimed(chainId, urlName, userId, roleId, provider)

const useIsTokenClaimed = (roleId: string) => {
  const { chainId, library } = useWeb3React<Web3Provider>()
  const { platform, urlName } = useDrop()
  const userId = useUserId(platform)
  const shouldFetch =
    typeof chainId === "number" &&
    !!library &&
    userId?.length > 0 &&
    urlName?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["isTokenClaimed", chainId, urlName, userId, roleId, library]
      : null,
    fetchIsTokenClaimed
  )

  return data
}

export default useIsTokenClaimed
