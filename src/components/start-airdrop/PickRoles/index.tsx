import {
  Button,
  FormControl,
  FormErrorMessage,
  Grid,
  VStack,
} from "@chakra-ui/react"
import useRoles from "hooks/discord/useRoles"
import { Plus } from "phosphor-react"
import { ReactElement, useState } from "react"
import { useFormState, useWatch } from "react-hook-form"
import RoleCard from "./components/RoleCard"

const PickRoles = (): ReactElement => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const { errors } = useFormState()

  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)

  return (
    <FormControl isInvalid={errors.roles?.message?.length > 0}>
      <VStack spacing={10}>
        <Grid width="full" templateColumns="repeat(5, 1fr)" gap={5}>
          {Object.entries(roles ?? {})
            .filter(([id]) => !selectedRoles.includes(id))
            .map(([id, name]) => (
              <Button
                leftIcon={<Plus />}
                colorScheme="purple"
                variant="outline"
                key={id}
                onClick={() => setSelectedRoles((prev) => [...prev, id])}
              >
                {name}
              </Button>
            ))}
        </Grid>

        <Grid width="full" templateColumns="repeat(3, 1fr)" gap={5}>
          {selectedRoles.map((roleId) => (
            <RoleCard
              key={roleId}
              roleId={roleId}
              unselectRole={() =>
                setSelectedRoles((prev) => prev.filter((id) => id != roleId))
              }
            />
          ))}
        </Grid>

        {errors.roles?.message && (
          <FormErrorMessage>{errors.roles.message}</FormErrorMessage>
        )}
      </VStack>
    </FormControl>
  )
}

export default PickRoles
