import { Box, Button, Flex, Heading, Img, VStack } from "@chakra-ui/react"
import { motion } from "framer-motion"
import Head from "next/head"
import { TelegramLogo } from "phosphor-react"

const Page = (): JSX.Element => (
  <>
    <Head>
      <title>Drop app</title>
      <meta property="og:title" content="Drop app" />
    </Head>

    <Box bgColor="#FAF9F6" minHeight="100vh">
      <Flex alignItems="center" justifyContent="center" h="80vh">
        <VStack spacing={8}>
          <motion.div
            style={{
              transform: "rotate(-15deg)",
            }}
            whileHover={{
              transform: "rotate(15deg)",
            }}
          >
            <Img boxSize={28} src="/logo.png" />
          </motion.div>
          <Heading fontFamily="display">Coming soon!</Heading>
          <Button
            as="a"
            colorScheme="telegram"
            leftIcon={<TelegramLogo />}
            href="https://t.me/+bMt6N5h4TRAyNjM0"
          >
            Join Telegram
          </Button>
        </VStack>
      </Flex>
    </Box>
  </>
)

export default Page
