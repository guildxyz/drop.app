import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import useRoleName from "components/[drop]/ClaimCard/hooks/useRoleName"
import { useDrop } from "components/[drop]/DropProvider"
import useEditRoleReward from "../hooks/useEditRoleReward"

type Props = {
  isOpen: boolean
  onClose: () => void
  roleId: string
}

const StopRoleModal = ({ isOpen, onClose, roleId }: Props) => {
  const { platform } = useDrop()
  const roleName = useRoleName(roleId)
  const { onSubmit, isLoading } = useEditRoleReward(roleId, onClose)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {platform === "DISCORD" ? `Stop drop on role "${roleName}"` : "Stop drop"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          This action will set the reward for the{" "}
          {platform === "DISCORD" ? `role "${roleName}"` : "drop"} to 0. This can be
          changed later, to reactivate this role in this drop.
        </ModalBody>

        <ModalFooter>
          <Button isDisabled={isLoading} variant="ghost" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            loadingText="Stopping"
            onClick={() => onSubmit({ newReward: 0 })}
            colorScheme="yellow"
          >
            Stop
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StopRoleModal
