const claimSignature = (
  chainId: number,
  roleId: string,
  serverId: string,
  account: string,
  tokenAddress: string
): Promise<string> =>
  fetch("/api/get-signature/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chainId,
      roleId,
      serverId,
      address: account,
      tokenAddress,
    }),
  }).then((response) =>
    response.json().then((body) => {
      if (response.ok) return body.signature
      throw new Error(JSON.stringify(body.errors))
    })
  )

export default claimSignature
