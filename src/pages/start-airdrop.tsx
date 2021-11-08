import { Alert, AlertIcon, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import Asset from "components/start-airdrop/Asset"
import NameInput from "components/start-airdrop/NameInput"
import PickRoles from "components/start-airdrop/PickRoles"
import ServerSelect from "components/start-airdrop/ServerSelect"
import SetMetaData from "components/start-airdrop/SetMetaData"
import SubmitButton from "components/start-airdrop/SubmitButton"
import TokenSelect from "components/start-airdrop/TokenSelect"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { GetServerSideProps } from "next"
import { FormProvider, useForm, useWatch } from "react-hook-form"

type Props = {
  inviteCode?: string
}

const StartAirdropPage = ({ inviteCode }: Props): JSX.Element => {
  const { account } = useWeb3React()

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
      invite_link: inviteCode?.length > 0 ? `https://discord.gg/${inviteCode}` : "",
      contractId: "",
      serverId: "",
      roles: {},
      metaDataKeys: {},
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

          {serverId?.length > 0 && (
            <>
              <Section title="Set metadata">
                <SetMetaData />
              </Section>
              <Section title="Pick roles">
                <PickRoles />
              </Section>
            </>
          )}

          <Section title="Choose an existing token, or deploy a new one">
            <TokenSelect />
          </Section>

          {contractId === "DEPLOY" && (
            <Section title="Choose a type of asset to deploy">
              <Asset />
            </Section>
          )}

          <SubmitButton />
        </VStack>
      </Layout>
    </FormProvider>
  )
}

const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    inviteCode:
      !!query.inviteCode && (query.inviteCode as string).match(/[a-z0-9]{8}/i)
        ? (query.inviteCode as string)
        : null,
  },
})

export { getServerSideProps }
export default StartAirdropPage
