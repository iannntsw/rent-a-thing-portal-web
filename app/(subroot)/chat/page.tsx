"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Link from "next/link";

export default function ChatsPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    setUserId(uid);

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", uid),
      orderBy("updatedAt", "desc")
    );
    console.log(q)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, []);

  if (!userId) return <p className="p-6">Please log in to view your chats.</p>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Your Chats</h1>
      {chats.length === 0 ? (
        <p className="text-gray-600">You have no chats yet.</p>
      ) : (
        <ul className="space-y-4">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="rounded border p-4 hover:shadow-md transition"
            >
              <Link
                href={`/chat/${chat.id}/${chat.listingId}`}
                className="block"
              >
                <p className="font-semibold">
                  Listing: {chat.listingTitle || "N/A"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Updated: {new Date(chat.updatedAt?.toDate()).toLocaleString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
