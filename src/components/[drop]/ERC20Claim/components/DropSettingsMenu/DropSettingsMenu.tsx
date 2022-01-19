import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { Gear } from "phosphor-react"
import AddRolesModal from "./components/AddRolesModal"

const DropSettingsMenu = () => {
  const {
    isOpen: isAddRolesModalOpen,
    onOpen: onAddRolesModalOpen,
    onClose: onAddRolesModalClose,
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
          <MenuItem onClick={onAddRolesModalOpen}>Add roles</MenuItem>
        </MenuList>
      </Menu>
      <AddRolesModal isOpen={isAddRolesModalOpen} onClose={onAddRolesModalClose} />
    </>
  )
}

export default DropSettingsMenu
