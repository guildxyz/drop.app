import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
} from "@chakra-ui/react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"

const GroupSelect = () => {
  const { errors } = useFormState()
  const { register } = useFormContext()
  const platform = useWatch({ name: "platform" })

  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" gap={5} p={5}>
      <FormControl>
        <FormLabel>1. Add Bot To Your Group</FormLabel>
        <Button
          colorScheme="darkerGray"
          h="10"
          w="full"
          as="a"
          href={`https://t.me/${process.env.NEXT_PUBLIC_TG_BOT_NAME}`}
          target="_blank"
        >
          @{process.env.NEXT_PUBLIC_TG_BOT_NAME}
        </Button>
      </FormControl>
      <FormControl isInvalid={errors.serverId}>
        <FormLabel>2. Paste ID</FormLabel>
        <Input
          placeholder="123456789"
          {...register("serverId", {
            required: platform === "TELEGRAM" && "This field is required.",
          })}
        />
        <FormErrorMessage>
          {errors.serverId?.message ?? "Invalid invite"}
        </FormErrorMessage>
      </FormControl>
    </Grid>
  )
}

export default GroupSelect
