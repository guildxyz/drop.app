import {
  FormControl,
  FormErrorMessage,
  StackDivider,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { useEffect } from "react"
import {
  useController,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
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
  const { setValue, clearErrors } = useFormContext()
  const { errors, dirtyFields } = useFormState()

  const { field } = useController({
    name: "platform",
    rules: { required: "You must pick a platform for your drop" },
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "platform",
    onChange: field.onChange,
    value: field.value,
  })

  const group = getRootProps()

  const platform = useWatch({ name: "platform" })

  useEffect(() => {
    if (dirtyFields.platform) {
      clearErrors(["serverId", "inviteLink", "channel"])
      setValue("serverId", "")
      setValue("inviteLink", "")
      setValue("channel", "")
    }
  }, [setValue, clearErrors, platform, dirtyFields])

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
