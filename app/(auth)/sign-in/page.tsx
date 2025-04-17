"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Text from "@/ui/text";
import Button from "@/ui/button";
import Input from "@/form/input";
import { cn } from "@/lib/utils";
import { signInUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithCustomToken } from "firebase/auth";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/");
    }
  }, [router]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await signInUser({ email, password });
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("userId", response.user.userId);
      localStorage.setItem("userEmail", response.user.email);
      localStorage.setItem("username", response.user.username);
      await signInWithCustomToken(auth, response.firebaseToken);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F5F7] px-4">
      <div
        className={cn([
          "w-full",
          "flex flex-col gap-8",
          "px-8 py-10",
          "rounded-lg bg-white shadow-xl",
          "sm:max-w-[480px] md:max-w-[520px] lg:max-w-[560px]",
        ])}
      >
        <div className="space-y-6 text-center">
          <h1 className="font-poppins text-[40px] font-medium text-[#121212]">
            Sign In
          </h1>
          <Text weight={400} color="gray">
            Don&apos;t have an account yet?{" "}
            <span className="font-semibold text-black hover:underline">
              <Link href="/sign-up">Sign Up</Link>
            </span>
          </Text>
        </div>
        <form onSubmit={handleSignIn} className="space-y-8">
          {error && (
            <div className="rounded-md border border-red-400 bg-red-100 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
            <Input
              intent="secondary"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
            <Input
              intent="secondary"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button width="full" className="py-2.5" type="submit">
            Sign In
          </Button>
        </form>

        {/* <div className="relative my-4 flex items-center justify-center">
          <div className="h-[1px] w-full bg-gray-300"></div>
          <span className="absolute bg-white px-4 text-gray-500">OR</span>
        </div> */}

        {/* Uncomment if you want social login later */}
        {/* <button
          onClick={() => signIn("google")}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-100"
        >
          <Image
            src="/images/google.png"
            alt="Google"
            width={20}
            height={20}
          />
          <span className="font-medium text-gray-700">
            Sign in with Google
          </span>
        </button> */}
      </div>
    </div>
  );
}
