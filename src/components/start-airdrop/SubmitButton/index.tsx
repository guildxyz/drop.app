import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import useIsAuthenticated from "hooks/discord/useIsAuthenticated"
import useStartAirdropMachine from "hooks/machines/useStartAirdropMachine"
import usePersonalSign from "hooks/usePersonalSign"
import { ReactElement, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import AuthenticateButton from "./components/AuthenticateButton"
import ConnectWalletButton from "./components/ConnectWalletButton"
import DeployTokenButton from "./components/DeployTokenButton"

const SubmitButton = (): ReactElement => {
  const { account } = useWeb3React()
  const isAuthenticated = useIsAuthenticated()
  const { isSigning, callbackWithSign } = usePersonalSign(true)
  const { onSubmit, isLoading, isSuccess } = useStartAirdropMachine()

  const { handleSubmit } = useFormContext()

  const loadingText = useMemo(() => {
    if (isSigning) return "Signing"
    if (isLoading) return "Starting airdrop"
  }, [isSigning, isLoading])

  const contractId = useWatch({ name: "contractId" })

  if (!account) return <ConnectWalletButton />

  if (contractId === "DEPLOY") return <DeployTokenButton />

  if (!isAuthenticated) return <AuthenticateButton />

  return (
    <CtaButton
      colorScheme="purple"
      disabled={!isAuthenticated || isSuccess}
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
