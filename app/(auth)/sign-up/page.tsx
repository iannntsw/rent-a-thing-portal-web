"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Text from "@/ui/text";
import Button from "@/ui/button";
import Input from "@/form/input";
import { cn } from "@/lib/utils";
import { signUp } from "lib/api/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/");
    }
  }, [router]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    userType: "CUSTOMER",
    profilePicture: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "Weak" | "Medium" | "Strong" | ""
  >("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwordStrength === "Weak") {
      setError("Password is too weak. Please choose a stronger password.");
      return;
    }

    try {
      const response = await signUp(formData);
      router.push("/sign-in");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const strength = (password: string): "Weak" | "Medium" | "Strong" | "" => {
      if (!password) return "";
      if (password.length < 6) return "Weak";
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSymbol = /[^A-Za-z0-9]/.test(password);

      if (
        password.length >= 8 &&
        hasUpper &&
        hasLower &&
        hasNumber &&
        hasSymbol
      ) {
        return "Strong";
      }

      return "Medium";
    };

    setPasswordStrength(strength(formData.password));
  }, [formData.password]);

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
            Sign Up
          </h1>
          <Text weight={400} color="gray">
            Already have an account?{" "}
            <span className="font-semibold text-black hover:underline">
              <Link href="/sign-in">Sign In</Link>
            </span>
          </Text>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="rounded-md border border-red-400 bg-red-100 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
            <Input
              intent="secondary"
              name="firstName"
              type="text"
              required={true}
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
            <Input
              intent="secondary"
              name="lastName"
              type="text"
              required={true}
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
            <Input
              intent="secondary"
              name="username"
              type="text"
              required={true}
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="relative border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
            <Input
              intent="secondary"
              name="password"
              type={showPassword ? "text" : "password"}
              required={true}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-sm text-gray-500 hover:text-gray-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

            {passwordStrength && (
              <div className="mt-2">
                <div className="h-2 w-full rounded bg-gray-200">
                  <div
                    className={cn("h-2 rounded", {
                      "w-1/3 bg-red-500": passwordStrength === "Weak",
                      "w-2/3 bg-yellow-500": passwordStrength === "Medium",
                      "w-full bg-green-500": passwordStrength === "Strong",
                    })}
                  />
                </div>
                <p
                  className={cn("mt-1 text-xs font-medium", {
                    "text-red-600": passwordStrength === "Weak",
                    "text-yellow-600": passwordStrength === "Medium",
                    "text-green-600": passwordStrength === "Strong",
                  })}
                >
                  Password strength: {passwordStrength}
                </p>
              </div>
            )}

            <p className="mt-1 text-xs text-gray-500">
              <strong>Weak:</strong> Less than 6 characters <br />
              <strong>Medium:</strong> At least 6 characters with letters and
              numbers <br />
              <strong>Strong:</strong> 8+ characters with upper, lower, numbers,
              and symbols
            </p>
          </div>
          <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
            <Input
              intent="secondary"
              name="email"
              type="email"
              required={true}
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
            <Input
              intent="secondary"
              name="phoneNumber"
              type="text"
              required={true}
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <Button width="full" className="py-2.5" type="submit">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
