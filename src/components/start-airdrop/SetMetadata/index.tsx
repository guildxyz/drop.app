import {
  Center,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack,
} from "@chakra-ui/react"
import useToast from "hooks/useToast"
import { Plus } from "phosphor-react"
import { ReactElement, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

export type MetaData = Record<string, string>

const SetMetadata = (): ReactElement => {
  const currentKeyId = useRef<number>(0)
  const [inputKey, setInputKey] = useState<string>("")
  const metaDataKeys = useWatch({ name: "metaDataKeys" })
  const { setValue } = useFormContext()
  const toast = useToast()

  const addNewKey = () => {
    if (inputKey.length === 0) {
      toast({
        status: "info",
        title: "Empty key",
        description: "Can't use empty text as a trait key",
      })
      return
    }
    const newMetaDataKeys = metaDataKeys
    newMetaDataKeys[currentKeyId.current] = inputKey
    currentKeyId.current++
    setValue("metaDataKeys", newMetaDataKeys)
    setInputKey("")
  }

  const removeKey = (key: string) => {
    const newMetaDataKeys = metaDataKeys
    delete newMetaDataKeys[key]
    setValue("metaDataKeys", newMetaDataKeys)
  }

  return (
    <VStack alignItems="left">
      <form
        onSubmitCapture={(event) => {
          event.preventDefault()
          addNewKey()
        }}
      >
        <InputGroup width="md">
          <Input
            value={inputKey}
            onChange={({ target: { value } }) => setInputKey(value)}
          />
          <InputRightElement>
            <IconButton
              size="sm"
              colorScheme="purple"
              variant="outline"
              icon={<Plus />}
              aria-label="Add metadata key"
              onClick={addNewKey}
            />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flexWrap="wrap">
        {Object.entries(metaDataKeys).map(([key, value]) => (
          <Center key={key} margin={1}>
            <Tag size="lg" borderRadius="lg" colorScheme="purple" variant="subtle">
              <TagLabel>{value}</TagLabel>
              <TagCloseButton onClick={() => removeKey(key)} />
            </Tag>
          </Center>
        ))}
      </Flex>
    </VStack>
  )
}

export default SetMetadata
