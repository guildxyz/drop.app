import { Alert, AlertDescription, AlertIcon, Flex, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import NameInput from "components/start-airdrop/NameInput"
import SelectAsset from "components/start-airdrop/SelectAsset"
import SelectPlatform from "components/start-airdrop/SelectPlatform"
import SubmitButton from "components/start-airdrop/SubmitButton"
import UploadNFTs from "components/start-airdrop/UploadNFTs"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"

const StartAirdropPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const { query } = useRouter()

  // TODO: Some of this might need to be restructured once we add telegram support
  const methods = useForm({
    shouldFocusError: true,
    mode: "all",
    defaultValues: {
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
      serverId: "",
      nfts: {},
      platform: "DISCORD",
    },
  })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  useEffect(() => {
    if (query.inviteCode) {
      methods.setValue("inviteLink", `https://discord.gg/${query.inviteCode}`)
    }
  }, [query, methods])

  if (!account)
    return (
      <Layout title="Drop to your community">
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>
            Please connect your wallet in order to continue!
          </AlertDescription>
        </Alert>
      </Layout>
    )

  return (
    <FormProvider {...methods}>
      <Layout title="Drop to your community">
        <VStack as="form" spacing={10}>
          <Section title="Set the platform you want to drop on">
            <SelectPlatform />
          </Section>

          <Section title="What kind of asset do you want to drop?">
            <SelectAsset />
          </Section>

          <Section title="Upload your NFTs">
            <UploadNFTs />
          </Section>

          <Section title="Set NFT collection name and symbol">
            <NameInput />
          </Section>

          <Flex width="full" justifyContent="end">
            <SubmitButton />
          </Flex>
        </VStack>
      </Layout>
    </FormProvider>
  )
}

export default StartAirdropPage
