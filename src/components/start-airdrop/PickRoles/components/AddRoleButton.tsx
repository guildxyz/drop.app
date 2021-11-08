import { Button } from "@chakra-ui/react"
import useIsActive from "hooks/airdrop/useIsActive"
import useRoleTokenAddress from "hooks/airdrop/useRoleTokenAddress"
import { Plus } from "phosphor-react"
import { Dispatch, ReactElement, SetStateAction } from "react"
import { useWatch } from "react-hook-form"

type Props = {
  roleId: string
  roleName: string
  setSelectedRoles: Dispatch<SetStateAction<string[]>>
}

const AddRoleButton = ({
  roleId,
  roleName,
  setSelectedRoles,
}: Props): ReactElement => {
  const contractId = useWatch({ name: "contractId" })
  const serverId = useWatch({ name: "serverId" })
  const tokenAddress = useRoleTokenAddress(contractId)
  const isActive = useIsActive(serverId, roleId, tokenAddress)

  // If we only want to display the inactive roles event when the address hasn't been selected
  // if (isActive === undefined || !!isActive) return null
  if (isActive !== undefined && !!isActive) return null

  return (
    <Button
      leftIcon={<Plus />}
      colorScheme="purple"
      variant="outline"
      key={roleId}
      onClick={() => setSelectedRoles((prev) => [...prev, roleId])}
    >
      {roleName}
    </Button>
  )
}

export default AddRoleButton
