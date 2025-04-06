"use client";

import ChatPage from "@/components/ui/chat/ChatPage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatPageWrapper({
  params,
}: {
  params: { chatId: string; listingId: string };
}) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      router.replace("/sign-in");
    } else {
      setUserEmail(email);
    }
  }, [router]);

  if (!userEmail) return <div>Loading...</div>;

  return (
    <ChatPage
      convoId={params.chatId}
      listingId={params.listingId}
      userEmail={userEmail}
    />
  );
}
