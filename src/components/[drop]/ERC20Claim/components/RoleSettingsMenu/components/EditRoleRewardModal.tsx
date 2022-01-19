import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Tooltip,
} from "@chakra-ui/react"
import { parseEther } from "@ethersproject/units"
import useRoleName from "components/[drop]/ClaimCard/hooks/useRoleName"
import { useMemo, useState } from "react"
import useEditRoleReward from "../hooks/useEditRoleReward"

type Props = {
  isOpen: boolean
  onClose: () => void
  roleId: string
}

const EditRoleRewardModal = ({ isOpen, onClose, roleId }: Props) => {
  const roleName = useRoleName(roleId)
  const { onSubmit, isLoading } = useEditRoleReward(roleId, onClose)
  const [reward, setReward] = useState<number>()
  const validReward = useMemo(
    () => typeof reward !== "number" || reward === 0,
    [reward]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit reward for role "{roleName}"</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          This action will set the reward for the role "{roleName}". This can be
          changed later.
          <NumberInput mt={5}>
            <NumberInputField
              placeholder="20"
              value={reward}
              onChange={({ target: { value } }) => setReward(+value)}
            />
          </NumberInput>
        </ModalBody>

        <ModalFooter>
          <Button isDisabled={isLoading} variant="ghost" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Tooltip
            isDisabled={!validReward}
            label="Reward has to be a number greater than 0"
          >
            <Box as="span" width="min">
              <Button
                isDisabled={validReward}
                isLoading={isLoading}
                loadingText="Stopping"
                onClick={() =>
                  onSubmit({ newReward: parseEther(reward.toString()) })
                }
                colorScheme="yellow"
              >
                Edit reward
              </Button>
            </Box>
          </Tooltip>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EditRoleRewardModal
