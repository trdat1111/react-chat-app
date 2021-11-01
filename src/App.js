import ChatForm from "./ChatForm";
import { SocketContext, socket } from "./service/socket";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import "firebase/firestore";
// import SideBar from "./SideBar";
// import TopBar from "./TopBar";

const app = initializeApp({
  apiKey: "AIzaSyDOofSw2v5JmttAA5Zq7NpSt29KRxrMSTE",
  authDomain: "react-chat-app-14bbc.firebaseapp.com",
  projectId: "react-chat-app-14bbc",
  storageBucket: "react-chat-app-14bbc.appspot.com",
  messagingSenderId: "124536530115",
  appId: "1:124536530115:web:07d149e3bd7ff7fa7fee76",
  measurementId: "G-RDPPX066N4",
});

const auth = getAuth(app);
// const store = firebase.firestore();

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
          <ChatForm auth={auth} user={user} />
        </SocketContext.Provider>
      </div>
    );
  }

  return <SignIn />;
}

export default App;
