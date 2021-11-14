import CtaButton from "components/common/CtaButton"
import { ReactElement } from "react"

const LoadingButton = (): ReactElement => (
  <CtaButton
    colorScheme="purple"
    flexShrink={0}
    size="lg"
    isLoading
    loadingText="Loading"
  >
    Loading
  </CtaButton>
)

export default LoadingButton
