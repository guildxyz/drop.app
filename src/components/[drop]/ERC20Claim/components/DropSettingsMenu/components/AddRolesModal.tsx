import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react"
import useRoles from "components/start-airdrop/NFTSections/components/Uploaders/hooks/useRoles"
import { useDrop } from "components/[drop]/DropProvider"
import { useMemo } from "react"
import AddRoleCard from "./AddRoleCard"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const AddRolesModal = ({ isOpen, onClose }: Props) => {
  const { dropName, roles, serverId, platform } = useDrop()
  const allRoles = useRoles(serverId, platform)

  const rolesToAddEntries = useMemo(
    () => Object.entries(allRoles ?? {}).filter(([roleId]) => !(roleId in roles)),
    [roles, allRoles]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add roles to drop "{dropName}"</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          The rewards of the added roles can be edited later.
          <VStack spacing={2} maxH="xs" mt={10} p={1} overflow="auto">
            {rolesToAddEntries.map(([roleId, roleName]) => (
              <AddRoleCard key={roleId} roleId={roleId} roleName={roleName} />
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AddRolesModal
