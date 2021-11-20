import { mutate } from "swr"

const authenticate = async (
  id: string,
  signer: string,
  signature: string
): Promise<void> => {
  const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discordId: id, signature }),
  })

  if (!authResponse.ok) {
    const errorBody = await authResponse.json()
    throw new Error(errorBody.message)
  }

  await mutate(["discordId", signer])
}

export default authenticate
