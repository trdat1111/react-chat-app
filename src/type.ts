import { DocumentData, Timestamp } from "@firebase/firestore";

export type RoomData =
  | {
      id: string;
      joined_user: [""];
      room_name: "";
      messages: {}[];
    }
  | DocumentData;

export interface MessageObj {
  id: string;
  user: string | null;
  text: string;
  created_at: Timestamp;
  photoURL: string | null;
}
