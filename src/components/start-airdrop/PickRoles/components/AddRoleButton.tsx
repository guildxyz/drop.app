import { Button } from "@chakra-ui/react"
import useIsActive from "hooks/useIsActive"
import { Plus } from "phosphor-react"
import { ReactElement } from "react"
import { useWatch } from "react-hook-form"
import useRoleTokenAddress from "../hooks/useRoleTokenAddress"

type Props = {
  roleId: string
  roleName: string
  setSelected: () => void
}

const AddRoleButton = ({ roleId, roleName, setSelected }: Props): ReactElement => {
  const contractId = useWatch({ name: "contractId" })
  const serverId = useWatch({ name: "serverId" })
  const platform = useWatch({ name: "platform" })
  const tokenAddress = useRoleTokenAddress(contractId)
  const isActive = useIsActive(platform, roleId, tokenAddress)

  // If we only want to display the inactive roles event when the address hasn't been selected
  // if (isActive === undefined || !!isActive) return null
  if (isActive !== undefined && !!isActive) return null

  return (
    <Button
      leftIcon={<Plus />}
      colorScheme="yellow"
      variant="outline"
      key={roleId}
      onClick={setSelected}
    >
      {roleName}
    </Button>
  )
}

export default AddRoleButton
