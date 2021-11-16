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
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
} from "@chakra-ui/react"
import useIsActive from "hooks/airdrop/useIsActive"
import useRoleTokenAddress from "hooks/airdrop/useRoleTokenAddress"
import useRoles from "hooks/discord/useRoles"
import Image from "next/image"
import { Plus, X } from "phosphor-react"
import { ReactElement, useEffect, useState } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
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
  const { register, setValue } = useFormContext()
  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)
  const [imagePreview, setImagePreview] = useState<string>("")
  const { errors } = useFormState()
  const [traitKey, setTraitKey] = useState<string>("")
  const traitKeyIds = useWatch({
    name: `roles.${roleId}.traitKeyIds`,
    defaultValue: {},
  })
  const traits = useWatch({
    name: `roles.${roleId}.traits`,
    defaultValue: {},
  })
  const contractId = useWatch({ name: "contractId" })
  const tokenAddress = useRoleTokenAddress(contractId)
  const isActive = useIsActive(serverId, roleId, tokenAddress)

  useEffect(() => {
    setValue(`roles.${roleId}.traits`, {})
  }, [])

  const addTrait = (event) => {
    event.preventDefault()
    const newId = Math.max(0, ...Object.keys(traitKeyIds).map((id) => +id)) + 1
    const newKeyIds = traitKeyIds
    newKeyIds[newId] = traitKey
    setValue(`roles.${roleId}.traitKeyIds`, newKeyIds)
    setTraitKey("")
  }

  const removeTrait = (id: string) => {
    const newKeyIds = traitKeyIds
    delete newKeyIds[id]
    setValue(`roles.${roleId}.traitKeyIds`, newKeyIds)
    const newTraits = traits
    delete traits[id]
    setValue(`roles.${roleId}.traits`, newTraits)
  }

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
        <VStack spacing={2}>
          {Object.entries(traitKeyIds ?? {}).map(([id, key]) => (
            <HStack key={id}>
              <InputGroup size="sm">
                <InputLeftAddon>{key}</InputLeftAddon>
                <Input {...register(`roles.${roleId}.traits.${id}`)} />
              </InputGroup>

              <IconButton
                size="sm"
                icon={<X />}
                aria-label="Remove trait"
                onClick={() => removeTrait(id)}
              />
            </HStack>
          ))}

          <form onSubmit={addTrait} onSubmitCapture={addTrait}>
            <HStack>
              <Input
                size="sm"
                value={traitKey}
                onChange={({ target: { value } }) => setTraitKey(value)}
                placeholder="key"
              />
              <IconButton
                as="label"
                htmlFor={`${roleId}_trait_key_submit`}
                size="sm"
                icon={<Plus />}
                aria-label="Add trait"
              />
              <Input id={`${roleId}_trait_key_submit`} type="submit" hidden />
            </HStack>
          </form>
        </VStack>
      </FormControl>
    </VStack>
  )
}

export default RoleCard
