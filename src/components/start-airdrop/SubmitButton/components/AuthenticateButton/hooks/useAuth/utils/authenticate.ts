import { Platform } from "contract_interactions/types"
import hashId from "contract_interactions/utils/hashId"
import { mutate } from "swr"

const authenticate = async (
  id: string,
  signer: string,
  signature: string,
  platform: Platform
): Promise<void> => {
  const hashedId = await hashId(id)
  const authResponse = await (platform === "DISCORD"
    ? fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discordId: id, signature, discordIdHash: hashedId }),
      })
    : fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, signature, hash: hashedId }),
      }))

  if (!authResponse.ok) {
    const errorBody = await authResponse.json()
    throw new Error(errorBody.message)
  }

  await mutate(["userId", signer, platform])
}

export default authenticate
