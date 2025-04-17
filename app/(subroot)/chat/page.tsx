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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, []);
  console.log(chats)
  if (!userId) return <p className="p-6">Please log in to view your chats.</p>;

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-left text-3xl font-semibold text-[#121212]">
          Conversations
        </h1>

        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-12 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <p className="text-gray-600">You have no conversations yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}/${chat.listingId}`}
              >
                <div className="flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-gray-50 hover:shadow-md mb-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#121212]">
                        Listing: {chat.listingTitle || "N/A"}
                      </h3>
                      {chat.updatedAt && (
                        <span className="text-xs text-gray-500">
                          Updated At: {chat.updatedAt.toDate().toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-gray-600">
                      {chat.lastMessage || "Start chatting about this listing"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
