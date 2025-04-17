// components/dialog/booking-dialog.tsx
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog/dialog";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

export default function BookingDialog({
  open,
  onOpenChange,
  disabledDates,
  availableRange,
  startDate,
  endDate,
  pricePerDay,
  setStartDate,
  setEndDate,
  setPricePerDay,
  editingBookingId,
  handleBookingAction,
  triggerDisabled,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  disabledDates: string[];
  availableRange: { from: string; until: string } | null;
  startDate: string;
  endDate: string;
  pricePerDay: string;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  setPricePerDay: (val: string) => void;
  editingBookingId: string | null;
  handleBookingAction: () => void;
  triggerDisabled: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="flex gap-2">
        <DialogTrigger asChild>
          <button
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={triggerDisabled}
          >
            Make Booking
          </button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingBookingId ? "Edit Booking" : "Book This Item"}</DialogTitle>
          <DialogDescription>Select your preferred dates and price per day.</DialogDescription>
        </DialogHeader>
        <DatePicker
          selected={startDate ? new Date(startDate) : null}
          onChange={(date: Date | null) =>
            setStartDate(date ? format(date, "yyyy-MM-dd") : "")
          }
          excludeDates={disabledDates.map((d) => new Date(d))}
          minDate={availableRange ? new Date(availableRange.from) : undefined}
          maxDate={availableRange ? new Date(availableRange.until) : undefined}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select start date"
          className="w-full rounded border px-3 py-2"
        />
        <DatePicker
          selected={endDate ? new Date(endDate) : null}
          onChange={(date: Date | null) => {
            if (!startDate || !date) return setEndDate("");

            const selectedStart = new Date(startDate);
            const selectedEnd = new Date(date);
            const hasOverlap = disabledDates.some((d) => {
              const dd = new Date(d);
              return dd >= selectedStart && dd <= selectedEnd;
            });
            if (hasOverlap) {
              alert("Selected range overlaps with an existing booking.");
              setEndDate("");
              return;
            }
            setEndDate(format(date, "yyyy-MM-dd"));
          }}
          excludeDates={disabledDates.map((d) => new Date(d))}
          minDate={startDate ? new Date(startDate) : undefined}
          maxDate={availableRange ? new Date(availableRange.until) : undefined}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select end date"
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
  );
}
