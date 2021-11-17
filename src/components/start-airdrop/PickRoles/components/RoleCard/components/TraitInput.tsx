import { Divider, HStack, IconButton, Input } from "@chakra-ui/react"
import { Minus } from "phosphor-react"
import { ReactElement } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  roleIndex: number
  traitIndex: number
  unselectTrait: () => void
}

const TraitInput = ({
  roleIndex,
  traitIndex,
  unselectTrait,
}: Props): ReactElement => {
  const { register } = useFormContext()
  const key = useWatch({ name: `roles.${roleIndex}.traits.${traitIndex}.key` })

  return (
    <HStack>
      <HStack spacing={0}>
        <Input
          borderRightWidth={0}
          borderRightRadius={0}
          size="sm"
          placeholder="key"
          {...register(`roles.${roleIndex}.traits.${traitIndex}.key`)}
        />

        <Divider orientation="vertical" />

        <Input
          borderLeftWidth={0}
          borderLeftRadius={0}
          size="sm"
          placeholder="value"
          {...register(`roles.${roleIndex}.traits.${traitIndex}.value`)}
        />
      </HStack>

      {key.length <= 0 && (
        <IconButton
          onClick={unselectTrait}
          size="xs"
          icon={<Minus />}
          aria-label="Remove trait"
        />
      )}
    </HStack>
  )
}

export default TraitInput
