import { VStack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import Asset from "components/start-airdrop/Asset"
import NameInput from "components/start-airdrop/NameInput"
import PickRoles from "components/start-airdrop/PickRoles"
import ServerSelect from "components/start-airdrop/ServerSelect"
import SubmitButton from "components/start-airdrop/SubmitButton"
import TokenSelect from "components/start-airdrop/TokenSelect"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"

const StartAirdropPage = (): JSX.Element => {
  const { query } = useRouter()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      name: "",
      urlName: "",
      channel: "",
      assetType: "NFT",
      assetData: {
        NFT: {
          name: "",
          symbol: "",
        },
      },
      inviteLink: "",
      contractId: "",
      serverId: "",
      roles: {},
    },
  })
  const serverId = useWatch({
    name: "serverId",
    control: methods.control,
  })
  const contractId = useWatch({
    name: "contractId",
    control: methods.control,
  })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  useEffect(() => {
    if (query.inviteCode) {
      methods.setValue("inviteLink", `https://discord.gg/${query.inviteCode}`)
    }
  }, [query, methods])

  return (
    <FormProvider {...methods}>
      <Layout title="Drop to your community">
        <VStack as="form" spacing={10}>
          <Section title="Choose a server">
            <ServerSelect />
          </Section>

          {serverId?.length > 0 && (
            <Section title="Pick roles">
              <PickRoles />
            </Section>
          )}

          <Section title="Choose an existing token, or deploy a new one">
            <TokenSelect />
          </Section>

          {contractId === "DEPLOY" && (
            <Section title="Choose a type of asset to deploy">
              <Asset />
            </Section>
          )}

          <Section title="Choose a name for your DROP">
            <NameInput />
          </Section>
          <SubmitButton />
        </VStack>
      </Layout>
    </FormProvider>
  )
}

export default StartAirdropPage
