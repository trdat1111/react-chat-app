import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED  } from "@firebase/firestore";

export const app = initializeApp({
  apiKey: "AIzaSyDOofSw2v5JmttAA5Zq7NpSt29KRxrMSTE",
  authDomain: "react-chat-app-14bbc.firebaseapp.com",
  projectId: "react-chat-app-14bbc",
  storageBucket: "react-chat-app-14bbc.appspot.com",
  messagingSenderId: "124536530115",
  appId: "1:124536530115:web:07d149e3bd7ff7fa7fee76",
  measurementId: "G-RDPPX066N4",
});

export const auth = getAuth(app);
// export const db = getFirestore(app);

export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") console.log(err.code);
  else if (err.code === "unimplemented") console.log(err.code);
})