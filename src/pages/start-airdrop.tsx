import { Alert, AlertIcon, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import Asset from "components/start-airdrop/Asset"
import NameInput from "components/start-airdrop/NameInput"
import PickRoles from "components/start-airdrop/PickRoles"
import ServerSelect from "components/start-airdrop/ServerSelect"
import SetMetadata from "components/start-airdrop/SetMetadata"
import SubmitButton from "components/start-airdrop/SubmitButton"
import TokenSelect from "components/start-airdrop/TokenSelect"
import {
  FormProvider,
  useController,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form"
const StartAirdropPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })
  const serverId = useWatch({
    name: "serverId",
    control: methods.control,
  })
  const contractId = useWatch({
    defaultValue: "",
    name: "contractId",
    control: methods.control,
  })
  const { errors } = useFormState({ control: methods.control })

  const { field } = useController({
    control: methods.control,
    defaultValue: "NFT",
    name: "assetType",
    rules: {
      validate: (value) => value.length > 0 || "You must pick at least one role",
    },
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
          <Section title="Choose an existing token, or deploy a new one">
            <TokenSelect />
          </Section>
          {contractId === "" ? null : contractId === "DEPLOY" ? (
            <Section title="Choose a type of asset to deploy">
              <Asset field={field} />
            </Section>
          ) : (
            <Section title="Set metadata">
              <SetMetadata />
            </Section>
          )}
          {!!serverId && errors?.name === undefined && (
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
