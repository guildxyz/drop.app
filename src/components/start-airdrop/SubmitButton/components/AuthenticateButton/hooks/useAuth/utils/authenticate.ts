import hashId from "contract_interactions/utils/hashId"
import { mutate } from "swr"

const authenticate = async (
  id: string,
  signer: string,
  signature: string
): Promise<void> => {
  const hashedId = await hashId(id)
  const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discordId: id, signature, discordIdHash: hashedId }),
  })

  if (!authResponse.ok) {
    const errorBody = await authResponse.json()
    throw new Error(errorBody.message)
  }

  await mutate(["discordId", signer])
}

export default authenticate
