"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getUserById } from "@/lib/api/user";

import Logo from "@/ui/assets/logo";
import { WishlistIcon, HamburgerMenu, ChatIcon } from "@/ui/assets/svg";
import NavLinks from "@/ui/navbar/navLinks";
import NavMobile from "@/ui/navbar/navMobile";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => setScroll(window.scrollY >= 32);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      getUserById(userId)
        .then(setUser)
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/sign-in");
  };

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/products?query=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch("");
    }
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-[40]",
        isHomePage
          ? scroll
            ? "bg-white shadow transition-colors duration-200 ease-in"
            : "bg-[#809671]"
          : "bg-white",
      )}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4">
        {/* Left: Logo and mobile menu */}
        <div className="flex items-center gap-1 lg:basis-1/4">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <HamburgerMenu className="w-6" />
          </button>
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Center: Nav links */}
        <div className="hidden lg:flex lg:basis-2/4 lg:justify-center">
          <NavLinks />
        </div>

        {/* Right: Search + Icons + Profile */}
        <div className="flex items-center gap-3 lg:basis-1/4 lg:justify-end">
          {/* Search bar */}
          <form
            onSubmit={handleNavSearchSubmit}
            className="hidden gap-2 lg:flex"
          >
            <input
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              type="text"
              placeholder="Search"
              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c3725]"
            />
            <button
              type="submit"
              className="rounded bg-[#2c3725] px-3 py-1 text-sm text-white hover:bg-[#1f251a]"
            >
              Go
            </button>
          </form>

          {/* Chat icon */}
          <Link href="/chat">
            <ChatIcon className="h-5 w-5 text-gray-700 hover:opacity-80" />
          </Link>

          {/* Profile + Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md px-2 text-sm font-medium hover:bg-gray-100"
              >
                <img
                  src={user.profilePicture || "/default-avatar.png"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full border object-cover"
                />
                <span>Hello, {user.username}</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-md">
                  <Link
                    href={`/profile/${user.userId}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/sign-in")}
              className="rounded-md bg-black px-4 py-1.5 text-sm text-white hover:bg-gray-900"
            >
              Sign In
            </button>
          )}

          {/* List button */}
          <Link href="/products/new-listing">
            <button className="rounded-md bg-[#2C3725] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#1f251a]">
              List
            </button>
          </Link>
        </div>

        {/* Mobile menu */}
        <NavMobile open={open} onClick={() => setOpen(false)} />
      </nav>
    </div>
  );
};

export default Navbar;
