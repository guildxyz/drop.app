import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import useStartAirdropMAchine from "hooks/useStartAirdropMachine"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"

const SubmitButton = () => {
  const { isSigning, callbackWithSign } = usePersonalSign(true)
  const { onSubmit, isLoading, isSuccess } = useStartAirdropMAchine()

  const {
    handleSubmit,
    formState: { isValid },
  } = useFormContext()

  const loadingText = useMemo(() => {
    if (isSigning) return "Signing"
    if (isLoading) return "Starting airdrop"
  }, [isSigning, isLoading])

  return (
    <CtaButton
      colorScheme="purple"
      disabled={!isValid || isLoading || isSigning || isSuccess}
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
