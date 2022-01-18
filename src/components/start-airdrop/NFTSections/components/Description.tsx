import { Input } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

const Description = () => {
  const { register } = useFormContext()
  return (
    <Input
      width="md"
      minH={100}
      pt={3}
      placeholder="Optional"
      as="textarea"
      {...register("description")}
    />
  )
}

export default Description
