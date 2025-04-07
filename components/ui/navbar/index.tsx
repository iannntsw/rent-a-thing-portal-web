"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Logo from "@/ui/assets/logo";
import {
  WishlistIcon,
  HamburgerMenu,
  ChatIcon,
} from "@/ui/assets/svg";
import NavLinks from "@/ui/navbar/navLinks";
import NavMobile from "@/ui/navbar/navMobile";
import { useRootContext } from "@/hooks/rootContext";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const router = useRouter();
  const isRootPage = useRootContext();
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleOnScroll = () => {
    setScroll(window.scrollY >= 32);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleOnScroll);
    return () => window.removeEventListener("scroll", handleOnScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const userId = localStorage.getItem("userId")
    if (token) {
      setIsAuthenticated(true);
      if (storedUsername) setUsername(storedUsername);
      if (userId) setUserId(userId)
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    router.push("/sign-in");
  };

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-[40]",
          isRootPage ? "bg-[#ffc95c]" : "bg-white",
          scroll && "bg-white shadow transition-colors duration-200 ease-in"
        )}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4 lg:justify-normal">
          <div className="flex items-center gap-1 lg:basis-1/4">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <HamburgerMenu className="w-6" />
            </button>
            <Logo />
          </div>

          <div className="hidden lg:flex lg:basis-2/4 lg:justify-center lg:gap-6">
            <NavLinks />
          </div>

          <div className="flex items-center gap-2 lg:basis-1/4 lg:justify-end lg:gap-4">
            <WishlistIcon className="h-6 w-6 cursor-pointer hover:opacity-80" />

            <div className="relative">
              <ChatIcon className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                42
              </span>
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
                >
                  Hello, {username}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg z-20">
                    <Link href={`/profile/${userId}`}

                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/sign-in")}
                className="rounded-md bg-black px-4 py-1.5 text-sm font-medium text-white transition hover:bg-gray-900"
              >
                Sign In
              </button>
            )}

            <Link href="/products/new-listing">
              <button className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700">
                List
              </button>
            </Link>
          </div>

          <NavMobile open={open} onClick={() => setOpen(false)} />
        </nav>
      </div>
    </>
  );
};

export default Navbar;