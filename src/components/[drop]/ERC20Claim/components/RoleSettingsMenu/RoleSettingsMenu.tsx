import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { Gear } from "phosphor-react"
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
          icon={<Gear size={25} weight="regular" />}
          aria-label="Role settings"
        />
        <MenuList>
          <MenuItem onClick={onStopModalOpen}>Stop</MenuItem>
          <MenuItem onClick={onEditModalOpen}>Edit reward</MenuItem>
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
