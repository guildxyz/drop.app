import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { ReactElement, useContext } from "react"

const ConnectWalletButton = (props: Record<string, string>): ReactElement => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal, isWalletSelectorModalOpen } =
    useContext(Web3Connection)

  return (
    <CtaButton
      colorScheme="purple"
      disabled={!!account}
      flexShrink={0}
      size="lg"
      isLoading={isWalletSelectorModalOpen}
      loadingText="Connecting wallet"
      onClick={openWalletSelectorModal}
      {...props}
    >
      Connect wallet
    </CtaButton>
  )
}

export default ConnectWalletButton
