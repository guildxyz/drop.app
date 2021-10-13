import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import { useFormContext } from "react-hook-form"
import useSubmitMachine from "./hooks/useSumbitMachine"

const SubmitButton = () => {
  const { isSigning, callbackWithSign } = usePersonalSign(true)
  const { onSubmit, isLoading, isSuccess } = useSubmitMachine()

  const {
    handleSubmit,
    formState: { isValid },
  } = useFormContext()

  return (
    <CtaButton
      colorScheme="purple"
      disabled={!isValid || isLoading || isSigning || isSuccess}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || isSigning}
      loadingText="Starting airdrop"
      onClick={callbackWithSign(handleSubmit(onSubmit))}
    >
      {isSuccess ? "Success" : "Start airdrop"}
    </CtaButton>
  )
}

export default SubmitButton
