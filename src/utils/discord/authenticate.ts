/* eslint-disable @typescript-eslint/no-throw-literal */
import { Event } from "hooks/machines/useAuthMachine/utils/types"
import { mutate } from "swr"
import BackendError from "utils/errors/BackendError"
import fetchUserData, { UserData } from "./fetchUserData"

const authenticate = async (
  event: Event<UserData>,
  signer: string,
  signature: string
): Promise<void> => {
  const {
    data: { id },
  } = await fetchUserData(event)

  const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discordId: id, signature }),
  })

  if (!authResponse.ok) {
    const errorBody = await authResponse.json()
    throw { error: new BackendError(errorBody.message ?? "Failed to authenticate") }
  }

  await mutate(["discordId", signer])
}

export default authenticate
