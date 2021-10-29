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
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import useRoles from "hooks/discord/useRoles"
import Image from "next/image"
import { Info, X } from "phosphor-react"
import { ReactElement, useRef, useState } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import FileUpload from "./FileUpload"

type Props = {
  roleId: string
  unselectRole: () => void
}

const RoleCard = ({ roleId, unselectRole }: Props): ReactElement => {
  const { register } = useFormContext()
  const metaDataKeys = useWatch({ name: "metaDataKeys" })
  const serverId = useWatch({ name: "serverId" })
  const formRoles = useWatch({ name: "roles" })
  const roles = useRoles(serverId)
  const fileInput = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const { errors } = useFormState()

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

  const clickUpload = () => fileInput.current.click()

  return (
    <VStack backgroundColor="whiteAlpha.100" borderRadius="lg" padding={5}>
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
          <Button
            size="sm"
            leftIcon={
              <Tooltip label="The provided hash is used over the uploaded image">
                <Info />
              </Tooltip>
            }
          >
            Upload image
          </Button>
        </FileUpload>
      </Box>

      <FormControl isInvalid={errors.roles?.[roleId]?.ipfsHash?.message?.length > 0}>
        <FormLabel>IPFS image hash</FormLabel>
        <Input
          size="sm"
          {...register(`roles.${roleId}.ipfsHash`, {
            validate: async (value) => {
              if (value.length === 0) return true
              const response = await fetch(`https://ipfs.fleek.co/ipfs/${value}`)
              return response.ok || "Not a valid IPSF hash"
            },
            onChange: ({ target: { value } }) => {
              if (value.length === 0) {
                setImagePreview(
                  URL.createObjectURL(formRoles?.[roleId]?.image?.[0] ?? "")
                )
                return
              }
              fetch(`https://ipfs.fleek.co/ipfs/${value}`).then((response) => {
                if (response.ok)
                  setImagePreview(`https://ipfs.fleek.co/ipfs/${value}`)
              })
            },
          })}
        />
        {errors.roles?.[roleId]?.ipfsHash?.message?.length > 0 && (
          <FormErrorMessage>
            {errors.roles[roleId].ipfsHash.message}
          </FormErrorMessage>
        )}
      </FormControl>

      {Object.keys(metaDataKeys).length > 0 && (
        <FormControl>
          <FormLabel>Set traits</FormLabel>
          <VStack spacing={2}>
            {Object.entries(metaDataKeys).map(([id, metaDataKey]) => (
              <InputGroup key={id} size="sm">
                <InputLeftAddon>{metaDataKey}</InputLeftAddon>
                <Input {...register(`roles.${roleId}.traits.${metaDataKey}`)} />
              </InputGroup>
            ))}
          </VStack>
        </FormControl>
      )}
    </VStack>
  )
}

export default RoleCard
