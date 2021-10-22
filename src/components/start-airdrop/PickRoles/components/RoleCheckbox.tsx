import {
  Box,
  CheckboxProps,
  Fade,
  FormControl,
  FormLabel,
  Input,
  useCheckbox,
  VStack,
} from "@chakra-ui/react"
import PhotoUploader from "components/common/PhotoUploader"
import useRoles from "hooks/discord/useRoles"
import useIsActive from "hooks/useIsActive"
import { Dispatch, ReactElement, SetStateAction, useEffect, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  id: string
  name: string
  images: Record<string, File>
  setImages: Dispatch<SetStateAction<Record<string, File>>>
  inputHashes: Record<string, string>
  setInputHashes: Dispatch<SetStateAction<Record<string, string>>>
  serverId: string
  tokenAddress: string
} & CheckboxProps

const RoleCheckbox = ({
  id,
  name,
  images,
  setImages,
  inputHashes,
  setInputHashes,
  serverId,
  tokenAddress,
  ...checkBoxProps
}: Props): ReactElement => {
  const {
    getInputProps,
    getCheckboxProps,
    state: { isChecked },
  } = useCheckbox(checkBoxProps)
  const checkBoxRef = useRef<HTMLInputElement>(null)
  const input = getInputProps()
  const checkbox = getCheckboxProps()
  const isActive = useIsActive(serverId, id, tokenAddress)
  const { setValue } = useFormContext()
  const roles = useWatch({ name: "roles", defaultValue: [] })
  const metaDataKeys = useWatch({ name: "metaDataKeys", defaultValue: [] })
  useEffect(() => {
    if (isActive && roles.includes(id))
      setValue(
        "roles",
        roles.filter((roleId) => roleId != id)
      )
  }, [isActive, roles, setValue, id])

  const allRoles = useRoles(serverId)
  const traits = useWatch({
    name: "traits",
    defaultValue: Object.fromEntries(
      Object.keys(allRoles ?? {}).map((roleId) => [
        roleId,
        Object.fromEntries(metaDataKeys.map((key) => [key, ""])),
      ])
    ),
  })

  if (isActive) return null

  return (
    <VStack>
      <Box width="full" as="label">
        <input ref={checkBoxRef} {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          _checked={{
            bg: "purple.600",
            color: "white",
            borderColor: "purple.600",
          }}
          px={5}
          py={3}
        >
          {name}
        </Box>
      </Box>
      {isChecked && (
        <VStack width="full">
          <PhotoUploader
            buttonShown={!inputHashes[id]}
            isDisabled={!!inputHashes[id]}
            photoPreview={
              (inputHashes[id] && `https://ipfs.fleek.co/ipfs/${inputHashes[id]}`) ||
              (images[id] && URL.createObjectURL(images[id]))
            }
            onPhotoChange={(image) => setImages({ ...images, [id]: image })}
          />
          <Fade in={!images[id]} unmountOnExit>
            <Input
              placeholder="IPFS hash"
              value={inputHashes[id]}
              onChange={({ target: { value } }) =>
                setInputHashes({ ...inputHashes, [id]: value })
              }
            />
          </Fade>
          {metaDataKeys.map((key) => (
            <FormControl key={key}>
              <FormLabel>{key}</FormLabel>
              <Input
                value={traits[id][key]}
                onChange={({ target: { value } }) =>
                  setValue("traits", {
                    ...traits,
                    [id]: { ...traits[id], [key]: value },
                  })
                }
              />
            </FormControl>
          ))}
        </VStack>
      )}
    </VStack>
  )
}

export default RoleCheckbox
