import { Alert, AlertDescription, AlertIcon, Flex, VStack } from "@chakra-ui/react"
// eslint-disable-next-line import/no-extraneous-dependencies
import { DevTool } from "@hookform/devtools"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import NFTSections from "components/start-airdrop/NFTSections"
import SelectAsset from "components/start-airdrop/SelectAsset"
import SelectPlatform from "components/start-airdrop/SelectPlatform"
import SubmitButton from "components/start-airdrop/SubmitButton"
import TokenSections from "components/start-airdrop/TokenSections"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useMemo } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"

const StartAirdropPage = (): JSX.Element => {
  const { account } = useWeb3React()

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
        TOKEN: {
          name: "",
          symbol: "",
          initialBalance: "",
        },
      },
      inviteLink: "",
      serverId: "",
      nfts: [],
      platform: "",
      description: "",
      tokenRewards: {},
    },
  })

  const assetType = useWatch({ name: "assetType", control: methods.control })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  const AssetSections = useMemo(() => {
    if (assetType === "NFT") return () => <NFTSections />
    if (assetType === "TOKEN") return () => <TokenSections />
    return null
  }, [assetType])

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

          <AssetSections />

          <Flex width="full" justifyContent="end">
            <SubmitButton />
          </Flex>
        </VStack>
      </Layout>
      {process.env.NODE_ENV === "development" && (
        <DevTool control={methods.control} />
      )}
    </FormProvider>
  )
}

export default StartAirdropPage
