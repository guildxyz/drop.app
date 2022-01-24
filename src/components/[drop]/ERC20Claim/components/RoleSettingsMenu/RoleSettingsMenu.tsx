import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { Gear, PauseCircle, PencilSimpleLine } from "phosphor-react"
import EditRoleRewardModal from "./components/EditRoleRewardModal"
import StopRoleModal from "./components/StopRoleModal"

type Props = {
  roleId: string
}

const RoleSettingsMenu = ({ roleId }: Props) => {
  const {
    isOpen: isStopModalOpen,
    onOpen: onStopModalOpen,
    onClose: onStopModalClose,
  } = useDisclosure()

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure()

  return (
    <>
      <Menu>
        <MenuButton
          p={3}
          as={IconButton}
          colorScheme="gray"
          icon={<Gear size={20} weight="regular" />}
          aria-label="Role settings"
          variant="ghost"
        />
        <MenuList>
          <MenuItem
            icon={<PencilSimpleLine size={20} weight="light" />}
            onClick={onEditModalOpen}
          >
            Edit reward
          </MenuItem>
          <MenuItem
            icon={<PauseCircle size={20} weight="light" />}
            color="red"
            _hover={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
            onClick={onStopModalOpen}
          >
            Stop
          </MenuItem>
        </MenuList>
      </Menu>
      <StopRoleModal
        isOpen={isStopModalOpen}
        onClose={onStopModalClose}
        roleId={roleId}
      />
      <EditRoleRewardModal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        roleId={roleId}
      />
    </>
  )
}

export default RoleSettingsMenu
