import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import { ReactElement, useContext } from "react"
import { useFormContext } from "react-hook-form"
import AuthenticateButton from "./components/AuthenticateButton"
import LoadingButton from "./components/LoadingButton"
import useStartAirdrop from "./hooks/useStartAirdrop"

const SubmitButton = (): ReactElement => {
  const { account } = useWeb3React()
  const isAuthenticated = useIsAuthenticated()
  const { onSubmit, isLoading } = useStartAirdrop()
  const { triedEager } = useContext(Web3Connection)

  const { handleSubmit } = useFormContext()

  if (!triedEager || (!!account && isAuthenticated === undefined))
    return <LoadingButton />

  if (!isAuthenticated) return <AuthenticateButton />

  return (
    <CtaButton
      colorScheme="yellow"
      disabled={!isAuthenticated}
      flexShrink={0}
      size="lg"
      isLoading={isLoading}
      loadingText="Starting airdrop"
      onClick={handleSubmit(onSubmit)}
    >
      Drop
    </CtaButton>
  )
}

export default SubmitButton
