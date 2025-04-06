export async function createBooking({
  listingId,
  startDate,
  endDate,
  pricePerDay,
  renteeEmail,
}: {
  listingId: string;
  startDate: string;
  endDate: string;
  pricePerDay: number;
  renteeEmail: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/bookings/createBooking`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listingId,
        startDate,
        endDate,
        pricePerDay,
        renteeEmail,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create booking");
  }

  return await response.json();
}

export async function acceptBooking(bookingId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/bookings/${bookingId}/accept`,
    {
      method: "PATCH",
    },
  );

  if (!res.ok) throw new Error("Failed to accept booking");
  return await res.json();
}

export async function updateBooking(data: {
  bookingId: string;
  startDate?: string;
  endDate?: string;
  pricePerDay?: number;
  status: string;
}) {
  let response: any;

  if (data.status == "Pending") {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/bookings/updateBooking/${data.bookingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: data.startDate,
          endDate: data.endDate,
          pricePerDay: data.pricePerDay,
          status: data.status,
        }),
      },
    );
  } else {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/bookings/updateBooking/${data.bookingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: data.status,
        }),
      },
    );
  }

  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(errMsg || "Failed to update booking");
  }

  return await response.json();
}

export async function getLatestBooking(listingId: string, renteeEmail: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/bookings/latest?listingId=${listingId}&renteeEmail=${renteeEmail}`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch latest booking");
    }
    const booking = await res.json();
    return booking;
  } catch (err) {
    throw err;
  }
}
