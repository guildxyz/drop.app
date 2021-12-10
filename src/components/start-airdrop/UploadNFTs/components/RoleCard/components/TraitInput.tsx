import {
  Divider,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react"
import { X } from "phosphor-react"
import { ReactElement } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  nftId: string
  traitIndex: number
  unselectTrait: () => void
}

const placeholders = [
  ["eg.: color", "eg.: red"],
  ["eg.: time", "eg.: season 1"],
]

const TraitInput = ({ nftId, traitIndex, unselectTrait }: Props): ReactElement => {
  const { register } = useFormContext()
  const key = useWatch({ name: `nfts.${nftId}.traits.${traitIndex}.key` })

  return (
    <HStack>
      <HStack spacing={0}>
        <InputGroup size="sm">
          <Input
            borderRightWidth={0}
            borderRightRadius={0}
            size="sm"
            placeholder={placeholders[traitIndex]?.[0] ?? ""}
            {...register(`nfts.${nftId}.traits.${traitIndex}.key`)}
          />

          <Divider orientation="vertical" />

          <Input
            borderLeftWidth={0}
            borderLeftRadius={0}
            borderRightRadius={key.length <= 0 ? 0 : undefined}
            size="sm"
            placeholder={placeholders[traitIndex]?.[1] ?? ""}
            {...register(`nfts.${nftId}.traits.${traitIndex}.value`)}
          />
          {key.length <= 0 && (
            <InputRightAddon
              p="2"
              onClick={unselectTrait}
              cursor="pointer"
              _hover={{ backgroundColor: "blackAlpha.50" }}
              _active={{ backgroundColor: "blackAlpha.200" }}
            >
              <X />
            </InputRightAddon>
          )}
        </InputGroup>
      </HStack>
    </HStack>
  )
}

export default TraitInput
