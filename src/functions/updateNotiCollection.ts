import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../service/firebase";

export default async function updateNotiCollection(roomId: string) {
  const user = auth.currentUser;
  const roomRef = doc(db, `group_messages/${roomId}`);
  const notiRef = doc(roomRef, `notifications/${user?.uid}`);
  const docSnap = await getDoc(notiRef);

  if (docSnap.data()?.hasNewMsg === false) return;
  await updateDoc(notiRef, {
    hasNewMsg: false,
  });
}
