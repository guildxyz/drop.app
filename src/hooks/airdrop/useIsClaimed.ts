import { useWeb3React } from "@web3-react/core"
import { claims } from "contract_interactions/airdrop"
import useDiscordId from "hooks/discord/useDiscordId"
import useSWR from "swr"

const getClaims = (
  _: string,
  chainId: number,
  account: string,
  discordId: string,
  serverId: string,
  roleId: string,
  tokenAddress: string
) => claims(chainId, account, discordId, serverId, roleId, tokenAddress)

const useIsClaimed = (
  serverId: string,
  roleId: string,
  tokenAddress: string
): boolean => {
  const { chainId, account } = useWeb3React()
  const discordId = useDiscordId()

  const shouldFetch =
    serverId?.length > 0 &&
    roleId?.length > 0 &&
    tokenAddress?.length > 0 &&
    discordId?.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["isClaimed", chainId, account, discordId, serverId, roleId, tokenAddress]
      : null,
    getClaims
  )

  return data
}

export default useIsClaimed
