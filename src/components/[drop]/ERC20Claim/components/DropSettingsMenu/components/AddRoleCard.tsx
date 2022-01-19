import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react"
import { parseEther } from "@ethersproject/units"
import { useState } from "react"
import useAddRoleToDrop from "../hooks/useAddRoleToDrop"

type Props = {
  roleId: string
  roleName: string
}

const AddRoleCard = ({ roleId, roleName }: Props) => {
  const [reward, setReward] = useState<number>()
  const { onSubmit, isLoading } = useAddRoleToDrop(roleId)

  return (
    <HStack>
      <FormControl>
        <Grid templateColumns="repeat(2, 1fr)" alignItems="center">
          <FormLabel>{roleName}</FormLabel>
          <NumberInput min={0} size="sm">
            <NumberInputField
              width="full"
              type="number"
              placeholder="10"
              value={reward}
              onChange={({ target: { value } }) => setReward(+value)}
            />
          </NumberInput>
        </Grid>
      </FormControl>
      {typeof reward === "number" && reward > 0 && (
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
      )}
    </HStack>
  )
}

export default AddRoleCard
