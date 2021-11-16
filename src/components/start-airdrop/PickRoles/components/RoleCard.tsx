import {
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import useIsActive from "hooks/airdrop/useIsActive"
import useRoleTokenAddress from "hooks/airdrop/useRoleTokenAddress"
import useRoles from "hooks/discord/useRoles"
import Image from "next/image"
import { Minus, Plus, X } from "phosphor-react"
import { ReactElement, useEffect, useState } from "react"
import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import FileUpload from "./FileUpload"

type Props = {
  roleId: string
  unselectRole: () => void
}

const validateFiles = (value: FileList) => {
  if (value?.length < 1) return "File is required"
  for (const actFile of Array.from(value)) {
    const fsMb = actFile.size / (1024 * 1024)
    const MAX_FILE_SIZE = 10
    if (fsMb > MAX_FILE_SIZE) {
      return "Max file size 10mb"
    }
  }
  return true
}

const RoleCard = ({ roleId, unselectRole }: Props): ReactElement => {
  const { register } = useFormContext()
  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)
  const [imagePreview, setImagePreview] = useState<string>("")
  const { errors } = useFormState()
  const contractId = useWatch({ name: "contractId" })
  const tokenAddress = useRoleTokenAddress(contractId)
  const isActive = useIsActive(serverId, roleId, tokenAddress)
  const traits = useWatch({ name: `roles.${roleId}.traits` })

  useEffect(() => console.log(traits), [traits])

  const {
    fields: traitFields,
    append,
    remove,
  } = useFieldArray({
    name: `roles.${roleId}.traits`,
  })

  const addTrait = () =>
    append({
      key: "",
      value: "",
    })

  useEffect(() => {
    if (traitFields.length <= 0) addTrait()
  }, [])

  useEffect(() => {
    if (isActive !== undefined && !!isActive) unselectRole()
  }, [isActive, unselectRole])

  return (
    <VStack backgroundColor="primary.200" borderRadius="lg" padding={5}>
      <HStack width="full" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">
          {roles[roleId]}
        </Text>
        <Center>
          <IconButton
            size="sm"
            borderRadius="full"
            aria-label={`Unselect role ${roles[roleId]}`}
            icon={<X />}
            onClick={unselectRole}
          />
        </Center>
      </HStack>

      {imagePreview.length > 0 && (
        <AspectRatio width="full" position="relative" ratio={1}>
          <Image
            src={imagePreview}
            alt="Uploaded NFT image"
            layout="fill"
            objectFit="cover"
          />
        </AspectRatio>
      )}

      <Box width="full">
        <FileUpload
          accept="image/*"
          register={register(`roles.${roleId}.image`, {
            validate: validateFiles,
            onChange: ({
              target: {
                files: [file],
              },
            }) => {
              if (file) setImagePreview(URL.createObjectURL(file))
            },
          })}
        >
          <Button size="sm">Upload image</Button>
        </FileUpload>
      </Box>

      <FormControl isInvalid={errors.roles?.[roleId]?.NFTName?.message?.length > 0}>
        <FormLabel>Name</FormLabel>
        <Input
          size="sm"
          {...register(`roles.${roleId}.NFTName`, {
            required: "Please give a name for this role NFT",
          })}
        />
        {errors.roles?.[roleId]?.NFTName?.message?.length > 0 && (
          <FormErrorMessage>{errors.roles[roleId].NFTName.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl>
        <FormLabel>Set traits</FormLabel>

        <VStack>
          {traitFields.map((field, index) => (
            <HStack key={field.id}>
              <HStack spacing={0}>
                <Input
                  borderRightWidth={0}
                  borderRightRadius={0}
                  size="sm"
                  placeholder="key"
                  {...register(`roles.${roleId}.traits.${index}.key`)}
                />

                <Divider orientation="vertical" />

                <Input
                  borderLeftWidth={0}
                  borderLeftRadius={0}
                  size="sm"
                  placeholder="value"
                  {...register(`roles.${roleId}.traits.${index}.value`)}
                />
              </HStack>

              <IconButton
                onClick={() => remove(index)}
                size="xs"
                icon={<Minus />}
                aria-label="Remove trait"
              />
            </HStack>
          ))}

          <IconButton
            onClick={addTrait}
            width="full"
            size="xs"
            icon={<Plus />}
            aria-label="Add a new trait"
          />
        </VStack>
      </FormControl>
    </VStack>
  )
}

export default RoleCard
