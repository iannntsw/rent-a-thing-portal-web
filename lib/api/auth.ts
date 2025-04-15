export async function signUp(data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/createUser`, {
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

export async function signInUser(data: { email: string; password: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return await res.json();
}

export function handleLogout(router?: any) {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    if (router) {
      router.replace("/sign-in");
    } else {
      window.location.href = "/sign-in";
    }
  }
}
