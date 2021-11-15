import CtaButton from "components/common/CtaButton"
import useIsAuthenticated from "hooks/discord/useIsAuthenticated"
import useAuthMachine from "hooks/machines/useAuthMachine"
import usePersonalSign from "hooks/usePersonalSign"
import { ReactElement, useMemo } from "react"

const AuthenticateButton = (props: Record<string, string>): ReactElement => {
  const isAuthenticated = useIsAuthenticated()
  const { isSigning, callbackWithSign } = usePersonalSign(true)

  const { isSuccess, isLoading, authenticate } = useAuthMachine()

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
      onClick={callbackWithSign(authenticate)}
      {...props}
    >
      Authenticate
    </CtaButton>
  )
}

export default AuthenticateButton
