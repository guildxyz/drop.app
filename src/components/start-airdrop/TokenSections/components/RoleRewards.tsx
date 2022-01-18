import {
  Alert,
  AlertIcon,
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import useRoles from "components/start-airdrop/NFTSections/components/Uploaders/hooks/useRoles"
import { CaretDown, CaretUp } from "phosphor-react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"

const RoleRewards = () => {
  const serverId = useWatch({ name: "serverId" })
  const platform = useWatch({ name: "platform" })
  const roles = useRoles(serverId, platform)
  const { trigger, register } = useFormContext()
  const { errors } = useFormState()

  if (!roles && serverId.length > 0)
    return (
      <HStack pl={5} spacing={5}>
        <Spinner color="gray.500" />
        <Text color="gray.600">Loading...</Text>
      </HStack>
    )

  return (
    <>
      <Collapse in={!roles && serverId.length <= 0}>
        <Alert status="info" mb="5">
          <AlertIcon />
          <p>
            Once you{" "}
            <chakra.span
              onClick={() => trigger("inviteLink", { shouldFocus: true })}
              fontWeight="medium"
              cursor="pointer"
              color="yellow.500"
            >
              select a server
            </chakra.span>
            , you can select some roles for these NFTs
          </p>
        </Alert>
      </Collapse>
      <Grid templateColumns="repeat(3, 1fr)" gap={5}>
        {Object.entries(roles ?? {}).map(([roleId, roleName]) => (
          <Card key={roleId} backgroundColor="white" borderRadius="md">
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
        ))}
      </Grid>
    </>
  )
}

export default RoleRewards
