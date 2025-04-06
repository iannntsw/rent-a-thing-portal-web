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
  renteeEmail: string
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/bookings/createBooking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listingId, startDate, endDate, pricePerDay, renteeEmail }),
  });

  if (!response.ok) {
    throw new Error("Failed to create booking");
  }

  return await response.json();
}
