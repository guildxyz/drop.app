import {
  AspectRatio,
  Box,
  Button,
  Center,
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
import { Plus, X } from "phosphor-react"
import { ReactElement, useEffect, useState } from "react"
import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import FileUpload from "../FileUpload"
import TraitInput from "./components/TraitInput"

type Props = {
  index: number
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

const RoleCard = ({ roleId, index, unselectRole }: Props): ReactElement => {
  const { register, getValues } = useFormContext()
  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)
  const [imagePreview, setImagePreview] = useState<string>("")
  const { errors } = useFormState()
  const contractId = useWatch({ name: "contractId" })
  const tokenAddress = useRoleTokenAddress(contractId)
  const isActive = useIsActive(serverId, roleId, tokenAddress)

  const {
    fields: traitFields,
    append,
    remove,
  } = useFieldArray({
    name: `roles.${index}.traits`,
  })

  const addTrait = () =>
    append({
      key: "",
      value: "",
    })

  useEffect(() => {
    if (traitFields.length <= 0) addTrait()
    // This should only be needed for dev mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          register={register(`roles.${index}.image`, {
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
          {...register(`roles.${index}.NFTName`, {
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
          {traitFields.map((field, traitIndex) => (
            <TraitInput
              key={field.id}
              roleIndex={index}
              traitIndex={traitIndex}
              unselectTrait={() => remove(traitIndex)}
            />
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
