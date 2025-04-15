import { authHeaders } from "../utils";

export async function createListing(userEmail: string, payload: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/listings/createListing/${userEmail}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
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
    {
      headers: {
        ...authHeaders(),
      }
    }
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
        headers: {
          ...authHeaders(),
        }
      },
    );
    if (!res.ok) throw new Error("Failed to fetch listing");
    return res.json();
  } catch (err) {
    return null;
  }
};

export async function updateListing(listingId: string, updatedData: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/listings/updateListing/${listingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(updatedData),
      },
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update listing");
    }

    return await res.json();
  } catch (err) {
    console.error("Error updating listing:", err);
    throw err;
  }
}

export async function deleteListing(listingId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/listings/deleteListing/${listingId}`, {
      method: "DELETE",
      headers: {
        ...authHeaders(),
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to delete listing");
    }
    return res.ok;
  } catch (err) {
    console.error("Error deleting listing:", err);
    throw err;
  }
}

