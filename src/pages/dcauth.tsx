import { Box, Heading, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { ReactElement, useEffect } from "react"

const DCAuth = (): ReactElement => {
  const router = useRouter()

  useEffect(() => {
    // We navigate to the index page if the dcauth page is used incorrectly
    // For example if someone just manually goes to /dcauth
    if (!window.location.hash) router.push("/")
    const fragment = new URLSearchParams(window.location.hash.slice(1))

    if (
      (!fragment.has("access_token") || !fragment.has("token_type")) &&
      (!fragment.has("error") || !fragment.has("error_description"))
    )
      router.push("/")

    const [accessToken, tokenType, error, errorDescription] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
      fragment.get("error"),
      fragment.get("error_description"),
    ]

    const target = window.location.origin

    const sendError = (name: string, description: string) =>
      window.opener &&
      window.opener.postMessage(
        {
          type: "DC_AUTH_ERROR",
          data: {
            name,
            description,
          },
        },
        target
      )

    // Error from authentication
    if (error) sendError(error, errorDescription)

    window.opener.postMessage(
      {
        type: "DC_AUTH_SUCCESS",
        data: { tokenType, accessToken },
      },
      target
    )
  }, [router])

  return (
    <Box p="6">
      <Heading size="md">You're being redirected</Heading>
      <Text>
        Closing the authentication window and taking you back to the site...
      </Text>
    </Box>
  )
}
export default DCAuth
