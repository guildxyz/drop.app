import CtaButton from "components/common/CtaButton"
import useIsAuthenticated from "hooks/discord/useIsAuthenticated"
import useAuthMachine from "hooks/machines/useAuthMachine"
import useStartAirdropMachine from "hooks/machines/useStartAirdropMachine"
import usePersonalSign from "hooks/usePersonalSign"
import { ReactElement, useMemo } from "react"
import { useFormContext } from "react-hook-form"

const SubmitButton = (): ReactElement => {
  const isAuthenticated = useIsAuthenticated()
  const { isSigning, callbackWithSign } = usePersonalSign(true)
  const { onSubmit, isLoading, isSuccess } = useStartAirdropMachine()
  const {
    isSuccess: isAuthSuccess,
    isLoading: isAuthLoading,
    authenticate,
  } = useAuthMachine()

  const {
    handleSubmit,
    formState: { isValid },
  } = useFormContext()

  const loadingText = useMemo(() => {
    if (isSigning) return "Signing"
    if (isLoading) return "Starting airdrop"
  }, [isSigning, isLoading])

  if (!isAuthenticated)
    return (
      <CtaButton
        colorScheme="purple"
        disabled={
          !!isAuthenticated ||
          !isValid ||
          isSigning ||
          isAuthSuccess ||
          isAuthLoading
        }
        flexShrink={0}
        size="lg"
        isLoading={isAuthLoading || isSigning}
        loadingText="Authenticating"
        onClick={callbackWithSign(authenticate)}
      >
        Authenticate
      </CtaButton>
    )

  return (
    <CtaButton
      colorScheme="purple"
      disabled={!isAuthenticated || !isValid || isLoading || isSigning || isSuccess}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || isSigning}
      loadingText={loadingText}
      onClick={callbackWithSign(handleSubmit(onSubmit))}
    >
      {isSuccess ? "Success" : "Drop"}
    </CtaButton>
  )
}

export default SubmitButton
