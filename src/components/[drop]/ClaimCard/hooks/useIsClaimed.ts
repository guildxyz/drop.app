import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useDrop } from "components/[drop]/DropProvider"
import { claims } from "contract_interactions/airdrop"
import { Platform } from "contract_interactions/types"
import useUserId from "hooks/useUserId"
import useSWR from "swr"

const getClaims = (
  _: string,
  chainId: number,
  userId: string,
  platform: Platform,
  roleId: string,
  tokenAddress: string,
  provider: Provider
) => claims(chainId, userId, platform, roleId, tokenAddress, provider)

const useIsClaimed = (roleId: string): boolean => {
  const { platform, tokenAddress } = useDrop()
  const { chainId, library } = useWeb3React<Web3Provider>()
  const userId = useUserId(platform)

  const shouldFetch =
    platform?.length > 0 &&
    roleId?.length > 0 &&
    tokenAddress?.length > 0 &&
    userId?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["isClaimed", chainId, userId, platform, roleId, tokenAddress, library]
      : null,
    getClaims
  )

  return data
}

export default useIsClaimed
