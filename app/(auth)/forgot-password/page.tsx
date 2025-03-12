"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/form/input";
import Button from "@/ui/button";
import Text from "@/ui/text";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessage("A password reset link has been sent to your email.");
    }, 1500);
  };

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen items-center justify-center bg-[#F3F5F7]">
      <div className="w-full max-w-md rounded-lg bg-white p-10 shadow-lg">
        <h1 className="mb-6 text-center font-poppins text-3xl font-bold">
          Forgot Password?
        </h1>
=======
    <div className="min-h-screen flex items-center justify-center bg-[#F3F5F7]">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="font-poppins text-3xl font-bold text-center mb-6">Forgot Password?</h1>
>>>>>>> upstream/feature/sign-up-page
        <Text className="text-center text-gray-600">
          Enter your email and we will send you a reset link.
        </Text>

<<<<<<< HEAD
        <form onSubmit={handleForgotPassword} className="mt-5 space-y-4">
=======
        <form onSubmit={handleForgotPassword} className="space-y-4 mt-5">
>>>>>>> upstream/feature/sign-up-page
          <Input
            className="w-full"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
<<<<<<< HEAD
          <Button
            width="full"
            className="py-2.5"
            type="submit"
            disabled={loading}
          >
=======
          <Button width="full" className="py-2.5" type="submit" disabled={loading}>
>>>>>>> upstream/feature/sign-up-page
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

<<<<<<< HEAD
        <p className="mt-4 text-center text-gray-600">
=======
        <p className="text-center text-gray-600 mt-4">
>>>>>>> upstream/feature/sign-up-page
          <Link href="/sign-in" className="text-black hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> upstream/feature/sign-up-page
