import CtaButton from "components/common/CtaButton"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import usePersonalSign from "hooks/usePersonalSign"
import { ReactElement, useMemo } from "react"
import useAuth from "./hooks/useAuth"

const AuthenticateButton = (props: Record<string, string>): ReactElement => {
  const isAuthenticated = useIsAuthenticated()
  const { isSigning, callbackWithSign } = usePersonalSign()

  const { isSuccess, isLoading, onAuthenticate } = useAuth()

  const loadingText = useMemo(() => {
    if (isSigning) return "Signing"
    if (isLoading) return "Authenticating"
  }, [isSigning, isLoading])

  return (
    <CtaButton
      colorScheme="yellow"
      disabled={!!isAuthenticated || isSuccess}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || isSigning}
      loadingText={loadingText}
      onClick={callbackWithSign(onAuthenticate)}
      {...props}
    >
      Authenticate
    </CtaButton>
  )
}

export default AuthenticateButton
