const grantSignature = (
  chainId: number,
  serverId: string,
  account: string,
  roleId: string,
  tokenAddress: string,
  recieverAddress: string
): Promise<string> =>
  fetch("/api/get-signature/grant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chainId,
      serverId,
      address: account,
      roleId,
      tokenAddress,
      recieverAddress,
    }),
  }).then((response) =>
    response.json().then((body) => {
      if (response.ok) return body.signature
      throw new Error(JSON.stringify(body.errors))
    })
  )

export default grantSignature
