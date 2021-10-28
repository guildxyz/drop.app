import CtaButton from "components/common/CtaButton"
import useIsAuthenticated from "hooks/discord/useIsAuthenticated"
import useAuthMachine from "hooks/machines/useAuthMachine"
import usePersonalSign from "hooks/usePersonalSign"
import { ReactElement, useMemo } from "react"
import { useFormState } from "react-hook-form"

const AuthenticateButton = (): ReactElement => {
  const isAuthenticated = useIsAuthenticated()
  const { isSigning, callbackWithSign } = usePersonalSign(true)

  const { isValid } = useFormState()

  const { isSuccess, isLoading, authenticate } = useAuthMachine()

  const loadingText = useMemo(() => {
    if (isSigning) return "Signing"
    if (isLoading) return "Authenticating"
  }, [isSigning, isLoading])

  return (
    <CtaButton
      colorScheme="purple"
      disabled={!!isAuthenticated || !isValid || isSigning || isSuccess || isLoading}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || isSigning}
      loadingText={loadingText}
      onClick={callbackWithSign(authenticate)}
    >
      Authenticate
    </CtaButton>
  )
}

export default AuthenticateButton
