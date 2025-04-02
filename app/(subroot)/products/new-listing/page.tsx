"use client";

import { useEffect, useState } from "react";
import RentForm from "@/components/form/create-listing-form";

export default function RentPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setEmail(payload.email);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  return (
    <div className="p-6">
      <RentForm userEmail={email} />
    </div>
  );
}
