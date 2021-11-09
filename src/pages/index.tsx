import { Box, Flex, Heading, Img, VStack } from "@chakra-ui/react"
import { motion } from "framer-motion"
import Head from "next/head"

const Page = (): JSX.Element => (
  <>
    <Head>
      <title>Drop app</title>
      <meta property="og:title" content="Drop app" />
    </Head>

    <Box
      bgColor="gray.100"
      bgGradient={`linear(white 0px, var(--chakra-colors-gray-100) 700px)`}
      minHeight="100vh"
    >
      <Flex alignItems="center" justifyContent="center" h="80vh">
        <VStack spacing={8}>
          <motion.div
            whileHover={{
              transform: "rotate(360deg)",
            }}
          >
            <Img boxSize={28} src="/logo.png" />
          </motion.div>
          <Heading fontFamily="display">Coming soon!</Heading>
        </VStack>
      </Flex>
    </Box>
  </>
)

export default Page
