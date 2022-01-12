import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import { Platform } from "contract_interactions/types"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import usePersonalSign from "hooks/usePersonalSign"
import { ReactElement, useMemo } from "react"
import { mutate } from "swr"
import { Rest } from "types"
import TelegramAuthButton, { TelegramUser } from "../TelegramAuthButton"
import useAuth from "./hooks/useAuth"
import authenticate from "./hooks/useAuth/utils/authenticate"

type Props = {
  platform: Platform
} & Rest

const AuthenticateButton = ({ platform, ...rest }: Props): ReactElement => {
  const { account } = useWeb3React()
  const isAuthenticated = useIsAuthenticated(platform)
  const { isSigning, callbackWithSign } = usePersonalSign()

  const { isSuccess, isLoading, onAuthenticate } = useAuth()

  const loadingText = useMemo(() => {
    if (isSigning) return "Signing"
    if (isLoading) return "Authenticating"
  }, [isSigning, isLoading])

  if (platform === "TELEGRAM")
    return (
      <TelegramAuthButton
        botName={process.env.NEXT_PUBLIC_TG_BOT_NAME}
        onAuth={callbackWithSign(
          async ({
            id,
            addressSignedMessage,
          }: TelegramUser & { addressSignedMessage: string }) => {
            await authenticate(
              id.toString(),
              account,
              addressSignedMessage,
              platform
            )
            await mutate(["userId", account, "DISCORD"])
          }
        )}
      />
    )

  return (
    <CtaButton
      colorScheme="yellow"
      disabled={!!isAuthenticated || isSuccess}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || isSigning}
      loadingText={loadingText}
      onClick={callbackWithSign(onAuthenticate)}
      {...rest}
    >
      Authenticate
    </CtaButton>
  )
}

export default AuthenticateButton
