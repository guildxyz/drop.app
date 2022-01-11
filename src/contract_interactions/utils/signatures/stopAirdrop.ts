const stopAirdropSignature = (
  chainId: number,
  serverId: string,
  platform: string,
  account: string,
  roleId: string,
  tokenAddress: string,
  contractId: number
): Promise<string> =>
  fetch("/api/get-signature/stop-airdrop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chainId,
      serverId,
      platform,
      address: account,
      roleId,
      tokenAddress,
      contractId,
    }),
  }).then((response) =>
    response.json().then((body) => {
      if (response.ok) return body.signature
      throw new Error(JSON.stringify(body.errors))
    })
  )

export default stopAirdropSignature
