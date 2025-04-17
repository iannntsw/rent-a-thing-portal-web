"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createReview } from "@/lib/api/bookings";
import Swal from "sweetalert2";

export default function ReviewDialog({
  listingId,
  reviewerId,
  recipientId,
  bookingId,
}: {
  listingId: string;
  reviewerId: string;
  recipientId: string;
  bookingId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async () => {
    try {
      setOpen(false);
      await createReview({
        listingId,
        reviewerId,
        recipientId,
        rating,
        reviewText,
        bookingId,
      });

      await Swal.fire({
        icon: "success",
        title: "Review Submitted",
        text: "Your review has been submitted successfully!",
      });
    } catch (error: any) {
      console.error("Error submitting review:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Failed to submit review. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700">
          Leave a Review
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience with the other party.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Rating (1–5)</span>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Review</span>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              rows={4}
              placeholder="Write your review here..."
            />
          </label>

          <button
            onClick={handleSubmit}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
