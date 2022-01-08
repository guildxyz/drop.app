import CtaButton from "components/common/CtaButton"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import { ReactElement } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import AuthenticateButton from "./components/AuthenticateButton"
import useStartAirdrop from "./hooks/useStartAirdrop"

const platformNFTError = {
  TELEGRAM: "Select an NFT",
  DISCORD: "Select at least one NFT",
}

const platformNFTContainerId = {
  TELEGRAM: "upload-nft",
  DISCORD: "upload-nfts",
}

const SubmitButton = (): ReactElement => {
  const platform = useWatch({ name: "platform" })
  const isAuthenticated = useIsAuthenticated(platform)
  const { onSubmit, isLoading } = useStartAirdrop()
  // const { triedEager } = useContext(Web3Connection)
  const nfts = useWatch({ name: "nfts" })

  const { handleSubmit, setError } = useFormContext()

  // if (!triedEager || (!!account && isAuthenticated === undefined))
  //   return <LoadingButton />

  if (!isAuthenticated) return <AuthenticateButton />

  return (
    <CtaButton
      colorScheme="yellow"
      disabled={!isAuthenticated}
      flexShrink={0}
      size="lg"
      isLoading={isLoading}
      loadingText="Starting airdrop"
      onClick={(event) => {
        if (nfts.length <= 0) {
          setError("nfts", {
            message: platformNFTError[platform] ?? "Unknown validation error",
          })
          handleSubmit(() => {})()
          document.getElementById(platformNFTContainerId[platform])?.focus()
        } else handleSubmit(onSubmit)(event)
      }}
    >
      Drop
    </CtaButton>
  )
}

export default SubmitButton
