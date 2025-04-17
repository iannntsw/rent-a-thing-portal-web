"use client";

import { useRouter, useSearchParams } from "next/navigation"; // 👈 Add useSearchParams
import { useEffect, useState } from "react";
import { createPayment, getBookingById } from "@/lib/api/bookings";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Swal from "sweetalert2";

export default function PaymentPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const { bookingId } = params;
  const searchParams = useSearchParams();
  const convoId = searchParams.get("convoId");
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        console.error("Failed to fetch booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await createPayment({
        bookingId: booking.bookingId,
        amount: booking.totalPrice,
        paymentMethod: "Credit Card",
        status: "Completed",
      });

      if (convoId) {
        await addDoc(collection(db, "conversations", convoId, "messages"), {
          sender: `${booking.rentee?.email}` || "System",
          type: "info",
          text: `💳 Payment of $${booking.totalPrice} completed.`,
          bookingId: booking.bookingId,
          createdAt: serverTimestamp(),
        });
      }

      setIsPaid(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Please try again.",
      });
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading payment details...</div>;
  }

  if (!booking) {
    return <div className="p-4 text-red-500">Booking not found.</div>;
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Payment for Booking</h1>
      <p>
        <strong>Listing:</strong> {booking.listing?.title || "N/A"}
      </p>
      <p>
        <strong>From:</strong>{" "}
        {new Date(booking.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong>To:</strong> {new Date(booking.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Price Per Day:</strong> ${booking.pricePerDay}
      </p>
      <p className="mb-4">
        <strong>Total:</strong> ${booking.totalPrice}
      </p>

      <button
        onClick={() => setShowDialog(true)}
        className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Pay Now
      </button>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            {!isPaid ? (
              <>
                <h2 className="mb-4 text-lg font-semibold">Confirm Payment</h2>
                <p className="mb-2">
                  You&apos;re about to pay{" "}
                  <strong>${booking.totalPrice}</strong>.
                </p>
                <p className="mb-4 text-sm text-gray-600">
                  Payment method: Credit Card
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDialog(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Confirm & Pay"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-2 text-lg font-semibold text-green-700">
                  Payment Successful 🎉
                </h2>
                <p className="mb-4">Thank you! Your booking has been paid.</p>
                <button
                  className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  onClick={() =>
                    router.push(
                      `/chat/${convoId}/${booking.listing?.listingId}`,
                    )
                  }
                >
                  Return to Chat
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
