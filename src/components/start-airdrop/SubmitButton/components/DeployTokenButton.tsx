import CtaButton from "components/common/CtaButton"
import useDeployTokenMachine from "hooks/machines/useDeployTokenMachine"
import { ReactElement, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

const DeployTokenButton = (): ReactElement => {
  const { onSubmit, isLoading, isSuccess } = useDeployTokenMachine()
  const { trigger } = useFormContext()
  const assetData = useWatch({ name: "assetData" })

  // TODO maybe do this with a machine
  const [validating, setValidating] = useState(false)
  const validate = async () => {
    const [isNameValid, isSymbolValid] = await Promise.all([
      trigger("assetData.NFT.name"),
      trigger("assetData.NFT.symbol"),
    ])
    return isNameValid && isSymbolValid
  }

  return (
    <CtaButton
      colorScheme="purple"
      disabled={isSuccess}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || validating}
      loadingText="Deploying"
      onClick={async () => {
        setValidating(true)
        const isValid = await validate()
        setValidating(false)
        if (isValid) onSubmit(assetData)
      }}
    >
      Deploy Token
    </CtaButton>
  )
}

export default DeployTokenButton
