import { IconButton, Input } from "@chakra-ui/react"
import { Plus } from "phosphor-react"
import { ReactElement, useState } from "react"
import { Send, State } from "../hooks/useMetaDataKeysMachine"

type Props = {
  state: State
  send: Send
}

const NewKeyButton = ({ state, send }: Props): ReactElement => {
  const [keyInput, setKeyInput] = useState<string>("")

  if (state.matches("idle"))
    return (
      <IconButton
        aria-label="Add metadata key"
        icon={<Plus />}
        colorScheme="purple"
        variant="outline"
        onClick={() => send("START")}
      />
    )

  return (
    <form
      onSubmitCapture={(event) => {
        event.preventDefault()
        send("ADD", { data: keyInput })
        setKeyInput("")
      }}
    >
      <Input
        autoFocus
        value={keyInput}
        onChange={({ target: { value } }) => setKeyInput(value)}
      />
    </form>
  )
}

export default NewKeyButton
