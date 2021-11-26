import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../service/firebase";
import { Modal } from "../service/sweet-alert";

export default async function createRoom() {
  const user = auth.currentUser;
  const { value: val } = await Modal.fire({
    title: "Enter a room to create",
    input: "text",
    confirmButtonColor: "#10B981",
  });
  if (val && val !== "") {
    const roomRef = await addDoc(collection(db, "group_messages"), {
      room_name: val,
    });

    const roomSnapshot = await getDoc(roomRef);
    if (roomSnapshot.exists()) {
      await updateDoc(roomRef, {
        joined_users: arrayUnion(user?.uid),
      });

      const notiRef = doc(roomRef, `notifications/${user?.uid}`);
      await setDoc(notiRef, {
        hasNewMsg: false,
      });
    }
  }
}
