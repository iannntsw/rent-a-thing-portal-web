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
    <div className="relative flex items-center justify-center bg-[#F3F5F7] lg:min-h-screen">
      <div
        className={cn([
          "grid lg:grid-cols-2",
          "max-w-[1440px]",
          "overflow-hidden",
          "lg:rounded-lg lg:shadow-2xl",
          "lg:max-h-[720px]",
          "lg:absolute lg:inset-0 lg:m-auto",
        ])}
      >
        <div className="relative flex items-center justify-center bg-[#F3F5F7] p-8 pt-20 lg:h-full">
          <Text
            family="poppins"
            size="2xl"
            color="black/900"
            weight={500}
            className="absolute left-0 top-8 w-full text-center"
          >
            Rent-A-Thing
          </Text>

          <Image
            src="/images/auth.png"
            width={2000}
            height={2000}
            alt="auth"
            className="w-full max-w-[420px] lg:h-[430px] lg:w-auto lg:max-w-none"
          />
        </div>

        <div className="flex justify-center bg-white">
          <div
            className={cn([
              "w-full",
              "flex flex-col gap-8 lg:justify-center",
              "px-8 py-10 lg:px-[88px]",
              "sm:max-w-[480px] md:max-w-[520px] lg:max-w-[560px]",
            ])}
          >
            <div className="space-y-6">
              <h1 className="font-poppins text-[40px] font-medium text-[#121212]">
                Sign In
              </h1>
              <Text weight={400} color="gray">
                Don&apos;t have an account yet?{" "}
                <span
                  className="font-semibold hover:underline"
                  style={{ color: "#809671" }}
                >
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

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="h-6 w-6 cursor-pointer rounded-md border border-[#6C7275] accent-black"
                  />

                </div>

                <Text
                  weight={600}
                  size="xs"
                  color="black/800"
                  className="hover:underline md:text-sm"
                >
                  <Link href="/forgot-password">Forgot password?</Link>
                </Text>
              </div> */}

              <Button width="full" className="py-2.5" type="submit">
                Sign In
              </Button>
            </form>

            {/* 
            <div className="relative my-4 flex items-center justify-center">
              <div className="h-[1px] w-full bg-gray-300"></div>
              <span className="absolute bg-white px-4 text-gray-500">OR</span>
            </div>
 
            <button
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
      </div>
    </div>
  );
}
