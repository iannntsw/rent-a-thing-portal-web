"use client";

// package
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

// ui
import Text from "@/ui/text";
import Button from "@/ui/button";

// form
import Input from "@/form/input";

// lib
import { cn } from "@/lib/utils";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      console.log("Signed in successfully!");
      // Redirect if needed
    } else {
      console.log("Invalid credentials");
    }
  };

  return (
    <div className="relative bg-[#F3F5F7] lg:min-h-screen flex items-center justify-center">
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
              "sm:max-w-[480px] md:max-w-[520px] lg:max-w-[560px] lg:max-w-[560px]",
            ])}
          >
            <div className="space-y-6">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    id="remember-me"
                    className="h-6 w-6 accent-black cursor-pointer rounded-md border border-[#6C7275]"
                  />
                  <label htmlFor="remember-me" className="text-gray-700 text-sm">
                    Remember me
                  </label>
                </div>

                <Text
                  weight={600}
                  size="xs"
                  color="black/800"
                  className="md:text-sm hover:underline"
                >
                  <Link href="/forgot-password">Forgot password?</Link>
                </Text>
              </div>

              <Button width="full" className="py-2.5" type="submit">
                Sign In
              </Button>
            </form>
          
            <div className="relative flex items-center justify-center my-4">
                <div className="w-full h-[1px] bg-gray-300"></div>
                <span className="absolute bg-white px-4 text-gray-500">OR</span>
            </div>

            <button
                onClick={() => signIn("google")}
                className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2 w-full hover:bg-gray-100 transition"
              >
                <Image
                  src="/images/google.png"
                  alt="Google"
                  width={20}
                  height={20}
                />
                <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}