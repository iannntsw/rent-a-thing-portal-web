export async function createListing(userEmail: string, payload: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/listings/createListing/${userEmail}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }

  return await res.json();
}

export const fetchAllListings = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/listings/getAllListing`,
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const getListingById = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/listings/getListing/${id}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) throw new Error("Failed to fetch listing");
    return res.json();
  } catch (err) {
    return null;
  }
};
