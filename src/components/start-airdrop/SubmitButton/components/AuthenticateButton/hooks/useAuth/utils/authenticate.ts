import { Platform } from "contract_interactions/types"
import hashId from "contract_interactions/utils/hashId"
import { mutate } from "swr"

const authenticate = async (
  id: string,
  signer: string,
  signature: string,
  platform: Platform
): Promise<void> => {
  const hash = await hashId(id)
  const authResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/${platform.toLowerCase()}/auth`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, signature, hash }),
    }
  )

  if (!authResponse.ok) {
    const errorBody = await authResponse.json()
    throw new Error(errorBody.message)
  }

  await mutate(["userId", signer, platform])
}

export default authenticate
