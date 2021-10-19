import { Alert, AlertIcon, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import Asset from "components/start-airdrop/Asset"
import NameInput from "components/start-airdrop/NameInput"
import PickRoles from "components/start-airdrop/PickRoles"
import ServerSelect from "components/start-airdrop/ServerSelect"
import SubmitButton from "components/start-airdrop/SubmitButton"
import TokenSelect from "components/start-airdrop/TokenSelect"
import { FormProvider, useForm, useWatch } from "react-hook-form"

const StartAirdropPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })
  const serverId = useWatch({
    name: "serverId",
    control: methods.control,
  })
  const contractId = useWatch({
    name: "contractId",
    control: methods.control,
  })

  if (!account)
    return (
      <Layout title="Drop to your community">
        <Alert status="error">
          <AlertIcon />
          Please connect your wallet to continue
        </Alert>
      </Layout>
    )

  return (
    <FormProvider {...methods}>
      <Layout title="Drop to your community">
        <VStack as="form" spacing={10}>
          <Section title="Choose a name for your DROP">
            <NameInput />
          </Section>
          <Section title="Choose a server">
            <ServerSelect />
          </Section>
          <Section title="Choose an existiong token">
            <TokenSelect />
          </Section>
          {(!contractId || contractId?.length <= 0) && (
            <Section title="Or choose a type of asset to deploy">
              <Asset />
            </Section>
          )}
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
