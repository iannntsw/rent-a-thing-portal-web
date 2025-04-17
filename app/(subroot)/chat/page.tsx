"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { getUserById } from "@/lib/api/user";

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  updatedAt: Timestamp;
  listingId: string;
  listingTitle?: string;
}

interface User {
  firstName: string;
  lastName: string;
  username?: string;
  profilePicture?: string;
}

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [chatUsers, setChatUsers] = useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    setUserId(uid);

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", uid),
      orderBy("updatedAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];
      setChats(chatsData);

      // Fetch user details for each chat
      const userPromises = chatsData.map(async (chat) => {
        const otherParticipantId = chat.participants.find(
          (p: string) => p !== uid,
        );
        if (otherParticipantId) {
          try {
            const userData = await getUserById(otherParticipantId);
            return { [otherParticipantId]: userData };
          } catch (error) {
            console.error("Error fetching user:", error);
            return { [otherParticipantId]: null };
          }
        }
        return {};
      });

      const userResults = await Promise.all(userPromises);
      const usersObject = userResults.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {},
      );
      setChatUsers(usersObject);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!userId) return <p className="p-6">Please log in to view your chats.</p>;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#2C3725]"></div>
      </div>
    );
  }

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
            {chats.map((chat) => {
              const otherParticipantId = chat.participants.find(
                (p: string) => p !== userId,
              );
              const otherUser = otherParticipantId
                ? chatUsers[otherParticipantId]
                : null;
              const lastMessageTime = chat.updatedAt
                ? new Date(chat.updatedAt.toDate())
                : null;

              // Format time as today, yesterday, or date
              const formatTime = (date: Date) => {
                if (!date) return "";
                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (date.toDateString() === today.toDateString()) {
                  return date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                } else if (date.toDateString() === yesterday.toDateString()) {
                  return "Yesterday";
                } else {
                  return date.toLocaleDateString();
                }
              };

              return (
                <Link key={chat.id} href={`/chat/${chat.id}/${chat.listingId}`}>
                  <div className="flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-gray-50 hover:shadow-md">
                    <div className="mr-4 flex-shrink-0">
                      <Image
                        src={otherUser?.profilePicture || "/default-avatar.png"}
                        alt={otherUser?.username || "User"}
                        className="h-14 w-14 rounded-full object-cover"
                        width={56}
                        height={56}
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-[#121212]">
                          {otherUser
                            ? `${otherUser.firstName} ${otherUser.lastName}`
                            : "Unknown User"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {lastMessageTime ? formatTime(lastMessageTime) : ""}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-gray-600">
                        {chat.lastMessage ||
                          "Start chatting about this listing"}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        Listing: {chat.listingTitle || "N/A"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
