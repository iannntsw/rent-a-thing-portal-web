// package
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

// lib
import { cn } from "@/lib/utils";

// css
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RentAThing",
  description: "RentAThing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, poppins.variable)}>
      <AuthProvider>
      <body>{children}</body>
      </AuthProvider>
    </html>
  );
}
