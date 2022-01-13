import Section from "components/common/Section"
import { useWatch } from "react-hook-form"
import NameInput from "./components/NameInput"
import MultipleUpload from "./components/Uploaders/MultipleUpload"
import SingleUpload from "./components/Uploaders/SingleUpload"

const nftUploadSection = {
  TELEGRAM: {
    title: "Upload your NFT",
    children: <SingleUpload />,
  },
  DISCORD: {
    title: "Upload your NFTs",
    children: <MultipleUpload />,
  },
}

const NFTSections = () => {
  const platform = useWatch({ name: "platform" })

  return (
    <>
      <Section {...nftUploadSection?.[platform]} />

      <Section title="Set NFT collection name and symbol">
        <NameInput />
      </Section>
    </>
  )
}

export default NFTSections
