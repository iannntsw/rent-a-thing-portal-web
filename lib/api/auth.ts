// lib/api/auth.ts

export async function signUp(data: any) {
  console.log(process.env.NEXT_PUBLIC_BACKEND_API)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/createUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Signup failed");
  }

  return res.json();
}
