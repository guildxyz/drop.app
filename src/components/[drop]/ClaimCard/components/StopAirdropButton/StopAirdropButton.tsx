import CtaButton from "components/common/CtaButton"
import { useDrop } from "components/[drop]/DropProvider"
import useIsActive from "hooks/useIsActive"
import { ReactElement, useMemo } from "react"
import useContractId from "./hooks/useContractId"
import useStopAirdrop from "./hooks/useStopAirdrop"

type Props = {
  roleId: string
}

const StopAirdropButton = ({ roleId }: Props): ReactElement => {
  const { serverId, urlName, platform } = useDrop()
  const { isLoading, response, onSubmit } = useStopAirdrop()
  const successfullyStopped = !!response
  const isActive = useIsActive(roleId)
  const contractId = useContractId()

  const loadingText = useMemo(() => {
    if (isLoading) return "Stopping airdrop"
    return "Loading"
  }, [isLoading])

  return (
    <CtaButton
      colorScheme="yellow"
      disabled={!isActive || successfullyStopped}
      flexShrink={0}
      size="sm"
      isLoading={isLoading || contractId === undefined}
      loadingText={loadingText}
      onClick={() => onSubmit({ serverId, roleId, contractId, urlName, platform })}
    >
      {successfullyStopped ? "Success" : "Stop"}
    </CtaButton>
  )
}

export default StopAirdropButton
