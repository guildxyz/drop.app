import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { Plus } from "phosphor-react"
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
          size="sm"
          as={Button}
          colorScheme="yellow"
          aria-label="Role settings"
        >
          Drop Settings
        </MenuButton>
        <MenuList>
          <MenuItem icon={<Plus />} onClick={onAddRolesModalOpen}>
            Add roles
          </MenuItem>
        </MenuList>
      </Menu>
      <AddRolesModal isOpen={isAddRolesModalOpen} onClose={onAddRolesModalClose} />
    </>
  )
}

export default DropSettingsMenu
