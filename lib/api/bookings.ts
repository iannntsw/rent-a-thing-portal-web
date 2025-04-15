import { authHeaders } from "../utils";

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
        ...authHeaders(),
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
      headers: {
        ...authHeaders(),
      }
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
          ...authHeaders(),
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
          ...authHeaders(),
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
      {
        headers: {
          ...authHeaders(),
        }
      }
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

export async function getBookingById(bookingId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/bookings/getBooking/${bookingId}`,
      {
        headers: {
          ...authHeaders(),
        }
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch booking");
    }
    const booking = await res.json();
    return booking;
  } catch (err) {
    throw err;
  }
}

export async function createPayment(paymentDetails: {
  bookingId: string;
  amount: number;
  paymentMethod: string;
  status: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/payments/createPayment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(paymentDetails),
  });

  if (!res.ok) {
    throw new Error("Failed to create payment");
  }

  return res.json();
}

export async function createReview(payload: {
  listingId: string;
  reviewerId: string;
  recipientId: string;
  rating: number;
  reviewText: string;
  bookingId?: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/reviews/createReview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create review");
  }

  return await res.json();
}
