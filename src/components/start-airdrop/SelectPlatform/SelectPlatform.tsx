import {
  FormControl,
  FormErrorMessage,
  StackDivider,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { useController, useFormState } from "react-hook-form"
import GroupSelect from "./components/GroupSelect"
import PlatformOption from "./components/PlatformOption"
import ServerSelect from "./components/ServerSelect"

const options = [
  {
    value: "TELEGRAM",
    color: "TELEGRAM",
    title: "Telegram",
    description: "Drop to the members of your group",
    icon: TelegramLogo,
    disabled: false,
    children: <GroupSelect />,
  },
  {
    value: "DISCORD",
    color: "DISCORD",
    title: "Discord",
    description: "Drop to people based on their roles",
    icon: DiscordLogo,
    disabled: false,
    children: <ServerSelect />,
  },
]

const SelectPlatform = () => {
  const { errors } = useFormState()

  const { field } = useController({
    name: "platform",
    rules: { required: "You must pick a realm for your guild" },
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "platform",
    onChange: field.onChange,
    value: field.value,
  })

  const group = getRootProps()

  return (
    <FormControl isRequired isInvalid={errors?.platform}>
      <VStack
        {...group}
        borderRadius="xl"
        bg="white"
        spacing="0"
        border="1px"
        borderColor="blackAlpha.300"
        divider={<StackDivider />}
      >
        {options.map((option) => (
          <PlatformOption
            key={option.value}
            {...getRadioProps({ value: option.value })}
            {...option}
          />
        ))}
      </VStack>

      <FormErrorMessage>{errors?.platform?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default SelectPlatform
