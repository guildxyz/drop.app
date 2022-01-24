import {
  Button,
  Fade,
  FormControl,
  FormLabel,
  Grid,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react"
import { parseEther } from "@ethersproject/units"
import { useEffect, useState } from "react"
import useAddRoleToDrop from "../hooks/useAddRoleToDrop"

type Props = {
  roleId: string
  roleName: string
  onClose: () => void
}

const AddRoleCard = ({ roleId, roleName, onClose }: Props) => {
  const [reward, setReward] = useState<number>()
  const { onSubmit, isLoading, response } = useAddRoleToDrop(roleId)

  useEffect(() => {
    if (!!response) onClose()
  }, [response, onClose])

  return (
    <FormControl>
      <Grid templateColumns="repeat(2, 1fr)" alignItems="center">
        <FormLabel>{roleName}</FormLabel>
        <Grid templateColumns="1fr auto" templateRows="1fr" gap={2}>
          <NumberInput min={0} size="sm">
            <NumberInputField
              width="full"
              type="number"
              placeholder="10"
              value={reward}
              onChange={({ target: { value } }) => setReward(+value)}
            />
          </NumberInput>
          <Fade in={typeof reward === "number" && reward > 0} unmountOnExit>
            <Button
              isLoading={isLoading}
              loadingText="Adding"
              isDisabled={typeof reward !== "number" || reward === 0}
              px={5}
              size="sm"
              colorScheme="yellow"
              onClick={() => onSubmit({ newReward: parseEther(reward.toString()) })}
            >
              Add
            </Button>
          </Fade>
        </Grid>
      </Grid>
    </FormControl>
  )
}

export default AddRoleCard
