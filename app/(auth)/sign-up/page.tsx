"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  }, []);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    userType: "CUSTOMER", // default value
    profilePicture: "", // optional, can leave empty
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await signUp(formData);
      router.push("/sign-in");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="relative bg-[#F3F5F7] lg:min-h-screen">
      <div
        className={cn([
          "grid lg:grid-cols-2",
          "max-w-[1440px]",
          "lg:rounded-lg lg:shadow-2xl",
          "lg:max-h-[720px]",
          "lg:absolute lg:inset-0 lg:m-auto",
        ])}
      >
        <div className="relative flex items-center justify-center bg-[#F3F5F7] p-8 pt-20 lg:h-full lg:rounded-l-lg">
          <Text
            family="poppins"
            size="2xl"
            color="black/900"
            weight={500}
            className="absolute left-0 top-8 w-full text-center"
          >
            Rent A Thing
          </Text>
          <Image
            src="/images/auth.png"
            width={2000}
            height={2000}
            alt="auth"
            className="w-full max-w-[420px] lg:h-[430px] lg:w-auto lg:max-w-none"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex justify-center bg-white lg:rounded-r-lg"
        >
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
                Sign Up
              </h1>
              <Text weight={400} color="gray">
                Already have an account?{" "}
                <span className="font-semibold text-[#38CB89] hover:underline">
                  <Link href="/sign-in">Sign In</Link>
                </span>
              </Text>
            </div>
            {error && (
              <div className="rounded-md border border-red-400 bg-red-100 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="space-y-8">
              <div className="border-b border-[#E8ECEF] pb-2">
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
              <div className="border-b border-[#E8ECEF] pb-2">
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
              <div className="border-b border-[#E8ECEF] pb-2">
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
              <div className="border-b border-[#E8ECEF] pb-2">
                <Input
                  intent="secondary"
                  name="password"
                  type="text"
                  required={true}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="border-b border-[#E8ECEF] pb-2">
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
              <div className="border-b border-[#E8ECEF] pb-2">
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
            </div>
            <Button width="full" className="py-2.5" type="submit">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
