import { Platform } from "contract_interactions/types"

const startAirdropSignature = (
  chainId: number,
  serverId: string,
  address: string,
  urlName: string,
  platform: Platform,
  roleIds: string[]
): Promise<string> =>
  fetch("/api/get-signature/erc20/start-airdrop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chainId,
      serverId,
      address,
      url: urlName,
      platform,
      roleIds,
    }),
  }).then((response) =>
    response.json().then((body) => {
      if (response.ok) return body.signature
      throw new Error(JSON.stringify(body))
    })
  )

export default startAirdropSignature
