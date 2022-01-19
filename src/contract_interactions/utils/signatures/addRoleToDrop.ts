const addRoleToDrop = (
  chainId: number,
  serverId: string,
  platform: string,
  address: string,
  roleId: string,
  urlName: string
): Promise<string> =>
  fetch("/api/get-signature/erc20/add-role", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chainId,
      serverId,
      address,
      urlName,
      platform,
      roleId,
    }),
  }).then((response) =>
    response.json().then((body) => {
      if (response.ok) return body.signature
      throw new Error(JSON.stringify(body.errors))
    })
  )

export default addRoleToDrop
