// components/dialog/review-dialog-trigger.tsx
"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function ReviewDialogTrigger({
  onSubmit,
}: {
  onSubmit: (review: { text: string; rating: string }) => Promise<void>;
}) {
  const [show, setShow] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({ text: reviewText, rating });
      setShow(false);
      await Swal.fire("Review Submitted", "Thanks for your feedback!", "success");
    } catch (err: any) {
      await Swal.fire("Submission Failed", err.message || "Try again later", "error");
    }
  };

  return (
    <>
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={() => setShow(true)}
      >
        Leave a Review
      </button>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-center text-lg font-semibold">Leave a Review</h2>
            <p className="mb-4 text-center text-sm text-gray-600">
              Let the community know how your experience went!
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                  onClick={() => setShow(false)}
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
    </>
  );
}
