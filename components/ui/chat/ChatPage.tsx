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
import {
  acceptBooking,
  createBooking,
  getLatestBooking,
  updateBooking,
} from "@/lib/api/bookings";
import { getListingById } from "@/lib/api/listings";
import ReviewDialog from "../review-dialog";

export default function ChatPage({
  listingId,
  convoId,
  userEmail,
}: {
  listingId: string;
  convoId: string;
  userEmail: string;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isRenter, setIsRenter] = useState(false);
  const [listingOwnerId, setListingOwnerId] = useState<string | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [latestBooking, setLatestBooking] = useState<any>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setShowReviewDialog(false);
      alert("Review submitted!");
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Error submitting review");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId);

    const checkOwnership = async () => {
      const listing = await getListingById(listingId);
      if (listing?.user?.userId) {
        setListingOwnerId(listing.user.userId);
        if (listing.user.userId === userId) {
          setIsRenter(true);
        }
      }
    };

    checkOwnership();
  }, [listingId]);

  useEffect(() => {
    const fetchLatestBooking = async () => {
      try {
        let renteeEmail = userEmail;
        if (isRenter) {
          const latestOfferMsg = [...messages]
            .reverse()
            .find((msg) => msg.type === "offer" && msg.bookingId);
          if (latestOfferMsg?.sender) {
            renteeEmail = latestOfferMsg.sender;
          } else {
            setLatestBooking(null);
            return;
          }
        }
        if (listingId && renteeEmail) {
          const booking = await getLatestBooking(listingId, renteeEmail);
          setLatestBooking(booking);
        }
      } catch (err) {
        setLatestBooking(null);
      }
    };

    fetchLatestBooking();
  }, [listingId, messages, isRenter]);

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

  const handleBookingAction = async () => {
    if (!startDate || !endDate || !pricePerDay) {
      return alert("Please fill in all booking fields.");
    }

    try {
      if (editingBookingId) {
        await updateBooking({
          bookingId: editingBookingId,
          startDate,
          endDate,
          pricePerDay: parseFloat(pricePerDay),
          status: "Pending",
        });

        await addDoc(collection(db, "conversations", convoId, "messages"), {
          sender: userEmail,
          text: `✏️ Booking request updated to ${startDate} → ${endDate} at $${pricePerDay}/day.`,
          type: "info",
          bookingId: editingBookingId,
          createdAt: serverTimestamp(),
        });

        alert("Booking updated!");
        setEditingBookingId(null);
      } else {
        const booking = await createBooking({
          listingId,
          startDate,
          endDate,
          pricePerDay: parseFloat(pricePerDay),
          renteeEmail: userEmail,
        });

        await addDoc(collection(db, "conversations", convoId, "messages"), {
          sender: userEmail,
          text: `📝 Booking offer sent from ${startDate} to ${endDate} at $${pricePerDay}/day`,
          type: "offer",
          bookingId: booking.bookingId,
          startDate,
          endDate,
          pricePerDay: parseFloat(pricePerDay),
          createdAt: serverTimestamp(),
        });

        alert("Booking created!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit booking");
    }
  };

  const handleAcceptOffer = async (
    bookingId: string,
    offerText: string,
    renteeEmail: string,
  ) => {
    try {
      await acceptBooking(bookingId);

      await addDoc(collection(db, "conversations", convoId, "messages"), {
        sender: userEmail,
        text: `✅ Booking accepted: ${offerText}. Please proceed to complete the payment.`,
        type: "info",
        bookingId,
        renteeEmail,
        createdAt: serverTimestamp(),
      });

      alert("Booking accepted! Payment request has been sent.");
    } catch (err) {
      console.error(err);
      alert("Failed to Booking offer");
    }
  };

  const openEditDialog = (bookingId: string) => {
    const offer = messages.find((msg) => msg.bookingId === bookingId);
    if (!offer) return;
    setStartDate(offer.startDate?.slice(0, 10));
    setEndDate(offer.endDate?.slice(0, 10));
    setPricePerDay(offer.pricePerDay?.toString());
    setEditingBookingId(bookingId);
  };

  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );
    if (!confirmCancel) return;

    try {
      await updateBooking({ bookingId, status: "Cancelled" });

      await addDoc(collection(db, "conversations", convoId, "messages"), {
        sender: userEmail,
        text: `❌ Booking request has been cancelled.`,
        type: "info",
        bookingId,
        createdAt: serverTimestamp(),
      });

      alert("Booking cancelled");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  const latestRequest = [...messages]
    .reverse()
    .find(
      (msg) =>
        msg.type === "info" &&
        msg.bookingId &&
        msg.text?.includes("✏️ Booking request updated"),
    );

  const hasActiveBooking = messages.some(
    (msg) =>
      msg.type === "offer" &&
      msg.sender === userEmail &&
      msg.bookingId &&
      !messages.some(
        (cancelMsg) =>
          cancelMsg.type === "info" &&
          cancelMsg.text?.includes("cancelled") &&
          cancelMsg.bookingId === msg.bookingId,
      ),
  );

  const handleCompleteBooking = async () => {
    try {
      await updateBooking({
        bookingId: latestBooking.bookingId,
        status: "Completed",
      });

      await addDoc(collection(db, "conversations", convoId, "messages"), {
        sender: "System",
        text: "✅ Booking has been marked as completed. Please consider leaving a review for each other!",
        type: "info",
        bookingId: latestBooking.bookingId,
        createdAt: serverTimestamp(),
      });

      setShowCompleteDialog(false);
      alert("Booking marked as complete. Review request sent!");
    } catch (err) {
      console.error("Failed to complete booking:", err);
      alert("Something went wrong while completing the booking.");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">Chat</h2>
        {showCompleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-2 text-lg font-semibold">Complete Booking</h2>
              <p className="mb-4 text-gray-700">
                Before completing the booking, please ensure the item has been
                returned in good condition and both parties are satisfied.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCompleteDialog(false)}
                  className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteBooking}
                  className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                  Complete Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {showReviewDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-2 text-center text-lg font-semibold">
                Leave a Review
              </h2>
              <p className="mb-4 text-center text-sm text-gray-600">
                Let the community know how your experience went!
              </p>
              <form
                onSubmit={handleSubmitReview}
                className="flex flex-col gap-3"
              >
                <textarea
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full rounded border p-2"
                />
                <select
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full rounded border p-2"
                >
                  <option value="">Rating</option>
                  <option value="5">🌟🌟🌟🌟🌟 (5)</option>
                  <option value="4">🌟🌟🌟🌟 (4)</option>
                  <option value="3">🌟🌟🌟 (3)</option>
                  <option value="2">🌟🌟 (2)</option>
                  <option value="1">🌟 (1)</option>
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowReviewDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isRenter && messages.find((m) => m.type === "offer" && m.bookingId) ? (
          (() => {
            const offerMsg = [...messages]
              .reverse()
              .find((m) => m.type === "offer" && m.bookingId);
            if (!offerMsg) return null;

            const isPending =
              latestBooking?.bookingId === offerMsg.bookingId &&
              latestBooking?.status === "Pending";

            if (latestBooking?.status === "Confirmed") {
              return (
                <button
                  className="mb-4 rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                  onClick={() => setShowCompleteDialog(true)}
                >
                  Complete Booking
                </button>
              );
            }

            if (isPending) {
              return (
                <button
                  onClick={() =>
                    handleAcceptOffer(
                      offerMsg.bookingId,
                      offerMsg.text,
                      offerMsg.sender,
                    )
                  }
                  className="mb-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Accept Booking
                </button>
              );
            }

            if (latestBooking?.status === "Completed") {
              return (
                <ReviewDialog
                  listingId={listingId}
                  reviewerId={currentUserId!}
                  recipientId={
                    isRenter ? latestBooking.rentee.userId : listingOwnerId!
                  }
                  bookingId={latestBooking.bookingId}
                />
              );
            }
          })()
        ) : !isRenter ? (
          <Dialog
            open={!!editingBookingId || undefined}
            onOpenChange={() => setEditingBookingId(null)}
          >
            <div className="flex gap-2">
              <DialogTrigger asChild>
                <button
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={hasActiveBooking && latestBooking?.status !== "Completed"}
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setPricePerDay("");
                    setEditingBookingId(null);
                  }}
                >
                  Make Booking
                </button>
              </DialogTrigger>

              {latestBooking?.status === "Accepted" && (
                <button
                  className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                  onClick={() =>
                    (window.location.href = `/payment/${latestBooking.bookingId}?convoId=${convoId}`)
                  }
                >
                  Complete Payment
                </button>
              )}

              {latestBooking?.status === "Completed" && (
                <ReviewDialog
                  listingId={listingId}
                  reviewerId={currentUserId!}
                  recipientId={
                    isRenter ? latestBooking.rentee.userId : listingOwnerId!
                  }
                  bookingId={latestBooking.bookingId}
                />
              )}
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBookingId ? "Edit Booking" : "Book This Item"}
                </DialogTitle>
                <DialogDescription>
                  Select your preferred dates and price per day.
                </DialogDescription>
              </DialogHeader>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded border px-3 py-2"
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
                onClick={handleBookingAction}
              >
                {editingBookingId ? "Update Booking" : "Confirm Booking"}
              </button>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="h-[300px] overflow-y-auto rounded border p-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold">{msg.sender}:</span>{" "}
            {msg.type === "offer" ? (
              <div className="flex flex-col">
                <span className="font-bold text-green-700">{msg.text}</span>
                {msg.sender === userEmail && (
                  <div className="mt-1 flex gap-2">
                    <button
                      onClick={() => openEditDialog(msg.bookingId)}
                      className="w-fit rounded bg-yellow-600 px-2 py-1 text-xs text-white hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancelBooking(msg.bookingId)}
                      className="w-fit rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : msg.type === "info" &&
              msg.bookingId &&
              msg === latestRequest &&
              currentUserId !== listingOwnerId ? (
              <div className="flex flex-col">
                <span>{msg.text}</span>
              </div>
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
