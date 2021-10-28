import CtaButton from "components/common/CtaButton"
import useDeployTokenMachine from "hooks/machines/useDeployTokenMachine"
import { ReactElement } from "react"
import { useWatch } from "react-hook-form"

const DeployTokenButton = (): ReactElement => {
  const { onSubmit, isLoading, isSuccess } = useDeployTokenMachine()

  const assetData = useWatch({ name: "assetData" })

  return (
    <CtaButton
      colorScheme="purple"
      disabled={
        isSuccess || assetData.name.length <= 0 || assetData.symbol.length <= 0
      }
      flexShrink={0}
      size="lg"
      isLoading={isLoading}
      loadingText="Deploying"
      onClick={() => onSubmit(assetData)}
      isDisabled={
        isSuccess || assetData.name.length <= 0 || assetData.symbol.length <= 0
      }
    >
      Deploy Token
    </CtaButton>
  )
}

export default DeployTokenButton
