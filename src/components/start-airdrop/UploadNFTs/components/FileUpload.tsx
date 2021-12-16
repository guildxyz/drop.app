import { InputGroup } from "@chakra-ui/react"
import { PropsWithChildren, ReactElement, useRef } from "react"
import { UseFormRegisterReturn } from "react-hook-form"

type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
}

const FileUpload = (props: PropsWithChildren<FileUploadProps>): ReactElement => {
  const { register, accept, children } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void
  }

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick} flex="1">
      <input
        type="file"
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
      />
      <>{children}</>
    </InputGroup>
  )
}

export default FileUpload
