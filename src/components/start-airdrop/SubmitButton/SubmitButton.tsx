import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import usePersonalSign from "hooks/usePersonalSign"
import { ReactElement, useContext, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import AuthenticateButton from "./components/AuthenticateButton"
import ConnectWalletButton from "./components/ConnectWalletButton"
import DeployTokenButton from "./components/DeployTokenButton"
import LoadingButton from "./components/LoadingButton"
import useStartAirdrop from "./hooks/useStartAirdrop"

const SubmitButton = (): ReactElement => {
  const { account } = useWeb3React()
  const isAuthenticated = useIsAuthenticated()
  const { isSigning, callbackWithSign } = usePersonalSign(true)
  const { onSubmit, isLoading, isSuccess } = useStartAirdrop()
  const { triedEager } = useContext(Web3Connection)

  const { handleSubmit } = useFormContext()

  const loadingText = useMemo(() => {
    if (isSigning) return "Signing"
    if (isLoading) return "Starting airdrop"
  }, [isSigning, isLoading])

  const contractId = useWatch({ name: "contractId" })

  if (!triedEager || (!!account && isAuthenticated === undefined))
    return <LoadingButton />

  if (!account) return <ConnectWalletButton />

  if (contractId === "DEPLOY") return <DeployTokenButton />

  if (!isAuthenticated) return <AuthenticateButton />

  return (
    <CtaButton
      colorScheme="yellow"
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
