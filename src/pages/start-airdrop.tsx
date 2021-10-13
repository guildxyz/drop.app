import { VStack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import Asset from "components/start-airdrop/Asset"
import NameInput from "components/start-airdrop/NameInput"
import PickRoles from "components/start-airdrop/PickRoles"
import ServerSelect from "components/start-airdrop/ServerSelect"
import SubmitButton from "components/start-airdrop/SubmitButton"
import { FormProvider, useForm, useWatch } from "react-hook-form"

const StartAirdropPage = (): JSX.Element => {
  const methods = useForm({ mode: "all" })
  const serverId = useWatch({
    name: "serverId",
    control: methods.control,
  })

  return (
    <FormProvider {...methods}>
      <Layout title="Drop to your community">
        <VStack as="form" onSubmit={methods.handleSubmit(console.log)} spacing={10}>
          <Section title="Choose a name for your DROP">
            <NameInput />
          </Section>
          <Section title="Choose a server">
            <ServerSelect />
          </Section>
          <Section title="Choose a type of asset">
            <Asset />
          </Section>
          {!!serverId && (
            <Section title="Pick roles">
              <PickRoles />
            </Section>
          )}

          <SubmitButton />
        </VStack>
      </Layout>
    </FormProvider>
  )
}

export default StartAirdropPage
