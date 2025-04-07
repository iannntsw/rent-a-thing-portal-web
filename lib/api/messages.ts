import {
  collection,
  addDoc,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function createOrGetChat(listingId: string, renterId: string, renteeId: string, listingTitle: string) {
  const chatQuery = query(
    collection(db, "conversations"),
    where("listingId", "==", listingId),
    where("renterId", "==", renterId),
    where("renteeId", "==", renteeId)
  );

  const snapshot = await getDocs(chatQuery);
  if (!snapshot.empty) {
    return { chatId: snapshot.docs[0].id, chatData: snapshot.docs[0].data() };
  }

  const newChatRef = await addDoc(collection(db, "conversations"), {
    listingTitle,
    listingId,
    renterId,
    renteeId,
    participants: [renterId, renteeId],
    lastMessage: "",
    updatedAt: serverTimestamp(),
  });

  return { chatId: newChatRef.id };
}

export async function sendMessage(chatId: string, senderId: string, text: string) {
  await addDoc(collection(db, `chats/${chatId}/messages`), {
    senderId,
    text,
    createdAt: serverTimestamp(),
  });

  await setDoc(doc(db, "chats", chatId), {
    lastMessage: text,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function listenToMessages(chatId: string, callback: (msgs: any[]) => void) {
  const msgQuery = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("createdAt")
  );

  return onSnapshot(msgQuery, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(msgs);
  });
}

export async function ensureConversationExists(convoId: string, metadata: { participants: string[] }) {
  const convoRef = doc(db, "conversations", convoId);
  const docSnap = await getDoc(convoRef);
  if (!docSnap.exists()) {
    await setDoc(convoRef, {
      participants: metadata.participants,
      createdAt: new Date(),
    });
  }
}

export async function getAllChats(userId: string) {
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", userId),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}


