"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createBooking } from "@/lib/api/bookings";

export default function ChatPage({
  listingId,
  convoId,
  userEmail,
}: {
  listingId: string,
  convoId: string;
  userEmail: string;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "conversations", convoId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [convoId]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await addDoc(collection(db, "conversations", convoId, "messages"), {
      sender: userEmail,
      text: message,
      createdAt: serverTimestamp(),
    });
    setMessage("");
  };

  const handleBookingSubmit = async () => {
    if (!startDate || !endDate || !pricePerDay) {
      return alert("Please fill in all booking fields.");
    }
  
    try {
      const data = {
        listingId,
        startDate,
        endDate,
        pricePerDay: parseFloat(pricePerDay),
        renteeEmail: userEmail,
      };
  
      await createBooking(data);
  
      const bookingText = `📝 Booking offer sent from ${startDate} to ${endDate} at $${pricePerDay}/day`;
      await addDoc(collection(db, "conversations", convoId, "messages"), {
        sender: userEmail,
        text: bookingText,
        type: "offer",
        createdAt: serverTimestamp(),
      });
  
      alert("Booking created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create booking");
    }
  };
  
  

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">Chat</h2>

        <Dialog>
          <DialogTrigger asChild>
            <button className="mb-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              Make Booking
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book This Item</DialogTitle>
              <DialogDescription>
                Select your preferred dates and offer a price per day.
              </DialogDescription>
            </DialogHeader>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="End Date"
            />
            <input
              type="number"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Your offer (price per day)"
            />
            <button
              className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
              onClick={handleBookingSubmit}
            >
              Confirm Booking
            </button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="h-[300px] overflow-y-auto rounded border p-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold">{msg.sender}:</span>{" "}
            {msg.type === "offer" ? (
              <span className="font-bold text-green-700">{msg.text}</span>
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 rounded border px-4 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
