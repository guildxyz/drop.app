import { UseToastOptions } from "@chakra-ui/react"

const showSuccessToast = (
  toast: (options?: UseToastOptions) => string | number
): void => {
  toast({
    title: "Success",
    description: "Airdrop started",
    status: "success",
  })
}

export default showSuccessToast
