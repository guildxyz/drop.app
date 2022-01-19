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
import useStopTokenDropForRole from "../hooks/useStopTokenDropForRole"

type Props = {
  isOpen: boolean
  onClose: () => void
  roleId: string
}

const StopRoleModal = ({ isOpen, onClose, roleId }: Props) => {
  const roleName = useRoleName(roleId)
  const { onSubmit, isLoading } = useStopTokenDropForRole(roleId)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Stop drop on role "{roleName}"</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          This action will set the reward for the role "{roleName}" to 0. This can be
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
