import { Box, Button, Fade, HStack, Icon, useColorMode } from "@chakra-ui/react"
import useToast from "hooks/useToast"
import Image from "next/image"
import { IconProps } from "phosphor-react"
import { forwardRef, LegacyRef, useEffect, useRef, useState } from "react"

type IconType = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>

type Props = {
  isInvalid?: boolean
  buttonIcon?: IconType
  buttonText?: string
  photoPreview?: string
  isDisabled?: boolean
  buttonShown?: boolean
  onPhotoChange?: (newPhoto: File) => void
}

const PhotoUploader = forwardRef(
  (
    {
      isInvalid,
      buttonIcon,
      buttonText,
      photoPreview,
      isDisabled = false,
      onPhotoChange,
      buttonShown = true,
    }: Props,
    ref: LegacyRef<HTMLDivElement>
  ): JSX.Element => {
    const toast = useToast()
    const fileInputRef = useRef()
    const { colorMode } = useColorMode()
    const [pickedPhoto, setPickedPhoto] = useState<File>()

    // Needed for displaying blob files
    const customImageLoader = ({ src }) => `${src}`

    const fileInputClick = () => {
      const fileInput = fileInputRef.current || null
      fileInput?.click()
    }

    const fileInputChange = (e) => {
      if (e.target.files[0].size < 1048576) setPickedPhoto(e.target.files[0])
      else
        toast({
          status: "error",
          title: "File too large",
          description: "Maximum allowed file size is 1MB",
          duration: 3000,
        })
    }

    // Set up the preview image & send the new file to the parent component
    useEffect(() => {
      if (pickedPhoto) {
        if (onPhotoChange) {
          onPhotoChange(pickedPhoto)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickedPhoto])

    return (
      <HStack position="relative" spacing={4} ref={ref}>
        {photoPreview ? (
          <Box
            position="relative"
            width={10}
            height={10}
            borderRadius="full"
            overflow="hidden"
          >
            <Image
              loader={customImageLoader}
              src={photoPreview}
              alt="Placeholder"
              layout="fill"
            />
          </Box>
        ) : (
          <Box width={10} height={10} rounded="full" bgColor="gray.100" />
        )}

        <Fade in={buttonShown} unmountOnExit>
          <Button
            leftIcon={buttonIcon && <Icon as={buttonIcon} />}
            variant="outline"
            borderWidth={1}
            rounded="md"
            size="sm"
            px={6}
            height={10}
            textColor={
              (isInvalid && (colorMode === "light" ? "red.500" : "red.200")) ||
              "current"
            }
            onClick={fileInputClick}
            isDisabled={isDisabled}
          >
            {buttonText || "Upload image"}
          </Button>
        </Fade>

        <input
          type="file"
          style={{ display: "none" }}
          accept="image/png, image/jpeg"
          onChange={fileInputChange}
          ref={fileInputRef}
        />
      </HStack>
    )
  }
)

export default PhotoUploader
