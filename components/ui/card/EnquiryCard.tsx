"use client";

import { useState } from "react";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import Image from "next/image";

export default function EnquiryCard() {
  const [flexible, setFlexible] = useState(false);

  return (
    <div className="max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Profile */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/listing-thumb.jpg" // Replace with your dynamic image
          alt="Host"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">Andrew G. <span className="ml-1 text-green-600">🎖️</span></p>
          <div className="text-sm text-gray-500">🟢 Active 2h 13 min ago</div>
        </div>
        <span className="ml-auto rounded-md border border-green-600 px-2 py-0.5 text-xs text-green-600">#Supervenue</span>
      </div>

      {/* Response Rate */}
      <p className="mt-4 text-sm text-gray-700">📊 Response rate - <strong>100%</strong></p>

      {/* Event Type */}
      <div className="mt-4 space-y-1">
        <label className="text-sm font-medium text-gray-700">Event type</label>
        <input
          type="text"
          placeholder="What event are you planning?"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-black focus:outline-none"
        />
      </div>

      {/* Date, Time, People */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">Select date</span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">People</label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm">
            <UserIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">Max 50</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">From</label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm">
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">From</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">To</label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm">
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">To</span>
          </div>
        </div>
      </div>

      {/* Flexible Checkbox */}
      <div className="mt-3 flex items-center space-x-2">
        <input
          id="flexible"
          type="checkbox"
          checked={flexible}
          onChange={() => setFlexible(!flexible)}
          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
        <label htmlFor="flexible" className="text-sm text-gray-700">
          I&apos;m flexible on dates and time
        </label>
      </div>

      {/* CTA Button */}
      <button className="mt-4 w-full rounded-md bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600">
        Enquire now
      </button>

      {/* Rating */}
      <div className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-700">
        <span className="text-green-500">★★★★★</span>
        <strong className="ml-1">4.7 Rating</strong>
        <span className="text-gray-500">on</span>
        <Image
          src="/images/reviews-io-logo.png"
          alt="Reviews.io"
          width={80}
          height={20}
        />
      </div>
    </div>
  );
}
