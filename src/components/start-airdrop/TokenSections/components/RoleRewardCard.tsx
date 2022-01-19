import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { CaretDown, CaretUp } from "phosphor-react"
import { useFormContext, useFormState } from "react-hook-form"
import { Rest } from "types"

type Props = {
  roleId: string
  roleName: string
} & Rest

const RoleRewardCard = ({ roleId, roleName, ...rest }: Props) => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  return (
    <Card key={roleId} backgroundColor="white" borderRadius="md" {...rest}>
      <FormControl
        width="full"
        height="full"
        isInvalid={!!errors?.tokenRewards?.DISCORD?.[roleId]}
      >
        <Grid templateColumns="repeat(2, 1fr)" alignItems="center">
          <FormLabel marginX={5} marginY={3}>
            {roleName}
          </FormLabel>

          <NumberInput min={0} size="lg" height="full">
            <NumberInputField
              borderLeftRadius={0}
              borderRightRadius="md"
              borderTopWidth={0}
              borderRightWidth={0}
              borderBottomWidth={0}
              width="full"
              height="full"
              type="number"
              placeholder="0"
              {...register(`tokenRewards.DISCORD.${roleId}`, {
                valueAsNumber: true,
              })}
            />

            <NumberInputStepper>
              <NumberIncrementStepper borderTopRightRadius="md">
                <CaretUp />
              </NumberIncrementStepper>
              <NumberDecrementStepper borderBottomRightRadius="md">
                <CaretDown />
              </NumberDecrementStepper>
            </NumberInputStepper>
          </NumberInput>

          <FormErrorMessage>
            {errors?.tokenRewards?.DISCORD?.[roleId]?.message}
          </FormErrorMessage>
        </Grid>
      </FormControl>
    </Card>
  )
}

export default RoleRewardCard
