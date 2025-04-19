"use client";
import "react-datepicker/dist/react-datepicker.css";

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
  acceptBooking,
  createBooking,
  getConfirmedBookings,
  getLatestBooking,
  updateBooking,
} from "@/lib/api/bookings";
import { getListingById } from "@/lib/api/listings";
import ReviewDialog from "../dialog/review-dialog";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Swal from "sweetalert2";
import BookingDialog from "../dialog/booking-dialog";
import { getUserByEmail } from "@/lib/api/user";

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
  const [disabledDates, setDisabledDates] = useState<string[]>([]);
  const [availableRange, setAvailableRange] = useState<{
    from: string;
    until: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listingInfo, setListingInfo] = useState<{
    title: string;
    image: string;
  } | null>(null);
  const [chatPartner, setChatPartner] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId);

    const checkOwnership = async () => {
      const listing = await getListingById(listingId);
      if (listing) {
        setAvailableRange({
          from: new Date(listing.availableFrom * 1000)
            .toISOString()
            .slice(0, 10),
          until: new Date(listing.availableUntil * 1000)
            .toISOString()
            .slice(0, 10),
        });

        let imageUrl = "/default-product.png";
        try {
          const parsed = JSON.parse(listing.images || "[]");
          if (parsed?.[0]) imageUrl = parsed[0];
        } catch {}

        setListingInfo({
          title: listing.title,
          image: imageUrl,
        });
      }

      if (listing?.user?.userId) {
        setListingOwnerId(listing.user.userId);
        if (listing.user.userId === userId) {
          setIsRenter(true);
        }
      }

      let chatWithEmail: string | null = null;

      if (listing.user?.email === userEmail) {
        const latestOffer = messages
          .slice()
          .reverse()
          .find((msg) => msg.type === "offer" && msg.sender !== userEmail);
        chatWithEmail = latestOffer?.sender || null;
      } else {
        chatWithEmail = listing.user?.email;
      }

      if (chatWithEmail) {
        const partner = await getUserByEmail(chatWithEmail);
        if (partner) setChatPartner(partner);
      }
    };

    checkOwnership();
  }, [listingId, messages, userEmail]);

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
  }, [listingId, messages, isRenter, userEmail]);

  useEffect(() => {
    const fetchDisabledDates = async () => {
      try {
        const bookings = await getConfirmedBookings(listingId);
        const disabled = new Set<string>();

        bookings.forEach((booking: any) => {
          const start = new Date(booking.startDate);
          const end = new Date(booking.endDate);
          const current = new Date(start);

          while (current <= end) {
            disabled.add(current.toISOString().slice(0, 10));
            current.setDate(current.getDate() + 1);
          }
        });

        setDisabledDates(Array.from(disabled));
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    if (listingId) fetchDisabledDates();
  }, [listingId]);

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

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return alert("Requested End date cannot be before Requested start date");
    }

    try {
      setIsDialogOpen(false);
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
          text: `✏️ Booking request updated to ${formatDateString(startDate)} → ${formatDateString(endDate)} at $${pricePerDay}/day.`,
          type: "info",
          bookingId: editingBookingId,
          createdAt: serverTimestamp(),
        });

        await Swal.fire({
          icon: "success",
          title: "Booking Updated",
          text: "Your booking has been successfully updated.",
        });
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
          text: `📝 Booking offer sent from ${formatDateString(startDate)} to ${formatDateString(endDate)} at $${pricePerDay}/day`,
          type: "offer",
          bookingId: booking.bookingId,
          startDate,
          endDate,
          pricePerDay: parseFloat(pricePerDay),
          createdAt: serverTimestamp(),
        });

        await Swal.fire({
          icon: "success",
          title: "Booking Created",
          text: "Your booking has been submitted successfully!",
        });
      }
    } catch (err: any) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: err.message || "Failed to submit booking.",
      });
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

      await Swal.fire({
        icon: "success",
        title: "Booking Accepted",
        text: "Payment request has been sent to the rentee.",
      });
    } catch (err: any) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Failed to Accept Booking",
        text:
          err.message ||
          "Something went wrong while accepting the booking offer.",
      });
    }
  };

  const openEditDialog = (bookingId: string) => {
    const offer = messages.find((msg) => msg.bookingId === bookingId);
    if (!offer) return;
    setStartDate(offer.startDate?.slice(0, 10));
    setEndDate(offer.endDate?.slice(0, 10));
    setPricePerDay(offer.pricePerDay?.toString());
    setEditingBookingId(bookingId);
    setIsDialogOpen(true);
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

      await Swal.fire({
        icon: "success",
        title: "Booking Cancelled",
        text: "The booking has been successfully cancelled.",
      });
    } catch (err: any) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Cancellation Failed",
        text:
          err.message || "Something went wrong while cancelling the booking.",
      });
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
      await Swal.fire({
        icon: "success",
        title: "Booking Completed",
        text: "Booking marked as complete. Review request sent!",
      });
    } catch (err: any) {
      console.error("Failed to complete booking:", err);
      await Swal.fire({
        icon: "error",
        title: "Completion Failed",
        text:
          err.message || "Something went wrong while completing the booking.",
      });
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl gap-6 p-4">
      {chatPartner && (
        <div className="w-1/4 min-w-[240px] rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
          <div className="flex flex-col items-center text-center">
            <Image
              src={chatPartner.profilePicture || "/images/default-user.png"}
              alt="User Profile"
              width={96}
              height={96}
              className="mb-3 rounded-full object-cover shadow"
            />
            <span className="text-sm text-yellow-600">
              ⭐ {chatPartner.averageRating?.toFixed(1)}
            </span>
            <h3 className="text-lg font-semibold text-gray-800">
              {chatPartner.username}
            </h3>
            <p className="text-sm text-gray-500">
              {chatPartner.firstName} {chatPartner.lastName}
            </p>
            <a
              href={`/profile/${chatPartner.userId}`}
              className="mt-1 text-sm text-blue-600 hover:underline"
            >
              View Profile
            </a>
          </div>

          <div className="mt-5 border-t pt-4 text-sm text-gray-700">
            {chatPartner.email && (
              <div className="mb-2 flex items-center gap-2">
                <span className="material-icons text-gray-400">Email: </span>
                <span className="truncate">{chatPartner.email}</span>
              </div>
            )}
            {chatPartner.phoneNumber && (
              <div className="mb-2 flex items-center gap-2">
                <span className="material-icons text-gray-400">Phone: </span>
                <span>{chatPartner.phoneNumber}</span>
              </div>
            )}
            {chatPartner.createdAt && (
              <div className="mb-2 flex items-center gap-2">
                <span className="material-icons text-gray-400">Joined:</span>
                <span>
                  {new Date(chatPartner.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                    },
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex-1 space-y-4">
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

          {isRenter &&
          messages.find((m) => m.type === "offer" && m.bookingId) ? (
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
            <div className="flex gap-2">
              <BookingDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) setEditingBookingId(null);
                }}
                disabledDates={disabledDates}
                availableRange={availableRange}
                startDate={startDate}
                endDate={endDate}
                pricePerDay={pricePerDay}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setPricePerDay={setPricePerDay}
                editingBookingId={editingBookingId}
                handleBookingAction={handleBookingAction}
                triggerDisabled={
                  hasActiveBooking && latestBooking?.status !== "Completed"
                }
              />

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
                  recipientId={listingOwnerId!}
                  bookingId={latestBooking.bookingId}
                />
              )}
            </div>
          ) : null}
        </div>
        {listingInfo && availableRange && (
          <a
            href={`/products/${listingId}`}
            className="mb-3 flex items-center gap-2 rounded border p-2 hover:bg-gray-100"
          >
            <Image
              src={listingInfo.image}
              alt="Listing Thumbnail"
              className="h-12 w-12 flex-shrink-0 rounded object-cover"
              width={48}
              height={48}
            />
            <div className="flex flex-col overflow-hidden">
              <h3 className="truncate text-xs font-medium text-gray-800">
                {listingInfo.title}
              </h3>
              <span className="text-[12px] text-gray-500">
                Availability: {formatDateString(availableRange.from)} –{" "}
                {formatDateString(availableRange.until)}
              </span>
            </div>
          </a>
        )}
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
    </div>
  );
}
