import { authHeaders } from "../utils";

export async function getUserById(userId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/getUser/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    profilePicture?: string;
    phoneNumber?: string;
  },
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/updateUser/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update user profile");
  }

  return await res.json();
}
