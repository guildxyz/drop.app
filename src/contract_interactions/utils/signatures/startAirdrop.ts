import BackendError from "utils/errors/BackendError"

const startAirdropSignature = (
  serverId: string,
  account: string,
  chainId: number,
  dropName: string
): Promise<string> =>
  fetch("/api/get-signature/start-airdrop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serverId,
      address: account,
      chainId,
      name: dropName,
    }),
  }).then((response) =>
    response.json().then((body) => {
      if (response.ok) return body.signature
      throw new BackendError(JSON.stringify(body.errors))
    })
  )

export default startAirdropSignature
