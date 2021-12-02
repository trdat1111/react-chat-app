import { DocumentData, Timestamp } from "@firebase/firestore";

export type RoomDataObj =
  | {
      id: string; // document id
      joined_users: string[];
      room_name: string;
      messages: MessageObj[];
      dateModified: Timestamp;
    }
  | DocumentData;

export interface MessageObj {
  id: string; // author's id
  user: string; // author's username
  userData: string;
  created_at: Timestamp;
  photoURL: string; // photoURL of author
  type: string; // data type: text or file extension
  fileName?: string;
  fileSize?: number;
}

export interface Members {
  userId: string;
  userName: string;
  userAvt: string;
}

export interface FileObj {
  fileName: string;
  fileUrl: string;
  fileSize: number;
}
