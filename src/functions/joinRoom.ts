import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../service/firebase";
import { Modal, Toast } from "../service/sweet-alert";

export default async function joinRoom() {
  const user = auth.currentUser;
  const { value: val } = await Modal.fire({
    title: "Enter a room ID to join in",
    input: "text",
    confirmButtonColor: "#8B5CF6",
  });
  if (val && val !== "") {
    const roomRef = doc(db, `group_messages/${val}`);
    const roomSnapshot = await getDoc(roomRef);
    if (roomSnapshot.exists()) {
      if (roomSnapshot.data().joined_users.includes(user?.uid)) {
        Toast.fire({
          icon: "error",
          title: "You're already joined this room!",
        });
      } else {
        // add userid to room doc and setRooms
        await updateDoc(roomRef, {
          joined_users: arrayUnion({
            userId: user?.uid,
            userName: user?.displayName,
            userAvt: user?.photoURL,
          }),
          // add notifications message
          messages: arrayUnion({
            id: user?.uid,
            user: user?.displayName!,
            userData: `${user?.displayName} has joined`,
            created_at: Timestamp.now(),
            photoURL: user?.photoURL!,
            type: "notification",
          }),
        });
        const notiRef = doc(roomRef, `notifications/${user?.uid}`);
        await setDoc(notiRef, {
          hasNewMsg: false,
        });
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Room not exist!",
      });
    }
  }
}
