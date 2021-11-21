import { DocumentData, Timestamp } from "@firebase/firestore";

export type RoomDataObj =
  | {
      id: string;
      joined_users: string[];
      room_name: string;
      messages: [];
    }
  | DocumentData;

export interface MessageObj {
  id: string;
  user: string;
  userData: string;
  created_at: Timestamp;
  photoURL: string;
  type: string;
  fileName?: string;
}
