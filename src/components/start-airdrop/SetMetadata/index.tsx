import { Center, Grid } from "@chakra-ui/react"
import { ReactElement } from "react"
import { useWatch } from "react-hook-form"
import NewKeyButton from "./components/NewKeyButton"
import useMetaDataKeysMachine from "./hooks/useMetaDataKeysMachine"

export type MetaData = Record<string, string>

const SetMetadata = (): ReactElement => {
  const [state, send] = useMetaDataKeysMachine()
  const metaDataKeys = useWatch({ name: "metaDataKeys", defaultValue: [] })

  return (
    <Grid templateColumns="repeat(7, 1fr)" gap={2}>
      {metaDataKeys.map((key: string) => (
        <Center key={key} backgroundColor="gray.700" paddingX={8} paddingY={2}>
          {key}
        </Center>
      ))}
      <NewKeyButton state={state} send={send} />
    </Grid>
  )
}

export default SetMetadata
