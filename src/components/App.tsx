import { SocketContext, socket } from "../service/socket";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../service/firebase";

// component
import ChatForm from "./ChatForm";
// import SideBar from "./SideBar";\

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <>
        <p>Loading...</p>
      </>
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
    socket.connect();
    return (
      <div className="container flex flex-col h-screen justify-center items-center font-nunito">
        <SocketContext.Provider value={socket}>
          <ChatForm />
        </SocketContext.Provider>
      </div>
    );
  }

  return <SignIn />;
}

function SignIn() {
  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <button
          className="button bg-yellow-500 hover:bg-yellow-600"
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default App;
