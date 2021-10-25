import { UseToastOptions } from "@chakra-ui/react"

const showErrorToast = (
  error: Error,
  toast: (options?: UseToastOptions) => string | number
): void => {
  try {
    const messages = JSON.parse(error.message)
    if (Array.isArray(messages))
      messages.forEach((err) =>
        toast({
          title: err.key || "Error",
          description: err.message,
          status: "error",
        })
      )
    else throw Error("")
  } catch {
    toast({
      title: error.name,
      description: error.message,
      status: "error",
    })
  }
}

export default showErrorToast
