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
    <div className="min-h-screen flex items-center justify-center bg-[#F3F5F7]">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="font-poppins text-3xl font-bold text-center mb-6">Forgot Password?</h1>
        <Text className="text-center text-gray-600">
          Enter your email and we will send you a reset link.
        </Text>

        <form onSubmit={handleForgotPassword} className="space-y-4 mt-5">
          <Input
            className="w-full"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button width="full" className="py-2.5" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

        <p className="text-center text-gray-600 mt-4">
          <Link href="/sign-in" className="text-black hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}