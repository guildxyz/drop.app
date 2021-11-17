import CtaButton from "components/common/CtaButton"
import useContractId from "hooks/airdrop/useContractId"
import useIsActive from "hooks/airdrop/useIsActive"
import useStopAirdropMachine from "hooks/machines/useStopAirdropMachine"
import { ReactElement, useMemo } from "react"

type Props = {
  roleId: string
  serverId: string
  tokenAddress: string
  urlName: string
}

const StopAirdropButton = ({
  roleId,
  serverId,
  tokenAddress,
  urlName,
}: Props): ReactElement => {
  const { isLoading, isSuccess, onSubmit } = useStopAirdropMachine()
  const isActive = useIsActive(serverId, roleId, tokenAddress)
  const contractId = useContractId(tokenAddress)

  const loadingText = useMemo(() => {
    if (isLoading) return "Stopping airdrop"
    return "Loading"
  }, [isLoading])

  return (
    <CtaButton
      colorScheme="yellow"
      disabled={!isActive || isSuccess}
      flexShrink={0}
      size="sm"
      isLoading={isLoading || contractId === undefined}
      loadingText={loadingText}
      onClick={() => onSubmit({ serverId, roleId, contractId, urlName })}
    >
      {isSuccess ? "Success" : "Stop"}
    </CtaButton>
  )
}

export default StopAirdropButton
