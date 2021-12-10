import { SocketContext, socket } from "../service/socket";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../service/firebase";
import {
  Flex,
  Heading,
  Button,
  Stack,
  Box,
  Link,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { BiLinkExternal } from "react-icons/bi";
import chat_icon from "../assets/chat-icon.svg";

// component
import App from "./App";

function LandingPage(): JSX.Element {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <Center className="h-screen">
        <Spinner
          thickness="5px"
          speed="0.65s"
          emptyColor="gray.200"
          color="green.500"
          size="xl"
        />
      </Center>
    );
  }
  if (error) {
    return (
      <>
        <p>Error: {error}</p>
      </>
    );
  }
  if (user) {
    // socket.connect();
    return (
      <div className="flex flex-row h-screen font-roboto">
        <SocketContext.Provider value={socket}>
          <App />
        </SocketContext.Provider>
      </div>
    );
  }

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <img src={chat_icon} className="w-12 h-12" alt="" />
        <Heading color="teal.400" m={5}>
          react-chat-app
        </Heading>
        <Box minW={{ base: "90%", md: "400px" }}>
          <Stack
            spacing={4}
            p="1rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >
            <Heading className="text-gray-600" textAlign="center" size="lg">
              Sign in
            </Heading>
            <SignInWithGoogle />;
          </Stack>
        </Box>
      </Stack>
      <Link
        color="teal.500"
        href="https://github.com/trdat123/react-chat-app"
        isExternal
        display="inline-flex"
        alignItems="center"
      >
        View source code on Github <BiLinkExternal className="ml-1" />
      </Link>
    </Flex>
  );
}

function SignInWithGoogle() {
  function signIn() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  }

  return (
    <Button onClick={signIn} leftIcon={<FcGoogle />} width="full">
      Sign in with Google
    </Button>
  );
}

export default LandingPage;
