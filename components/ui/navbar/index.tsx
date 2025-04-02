"use client";

// package
import { useEffect, useState } from "react";

// ui
import Logo from "@/ui/assets/logo";
import {
  CartIcon,
  HamburgerMenu,
  NotificationCount,
  SearchIcon,
  UserIcon,
  WishlistIcon,
  BellIcon,
  ChatIcon,
} from "@/ui/assets/svg";
import NavLinks from "@/ui/navbar/navLinks";
import NavMobile from "@/ui/navbar/navMobile";
import PromoSection from "@/ui/promo";
import { useRouter } from "next/navigation";

// hooks
import { useRootContext } from "@/hooks/rootContext";

// lib
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const router = useRouter();
  const isRootPage = useRootContext();
  const [open, setOpen] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleOnScroll = () => {
    window.scrollY >= 32 ? setScroll(true) : setScroll(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleOnScroll);
    return () => window.removeEventListener("scroll", handleOnScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      {!open && <PromoSection />}
      <div
        className={cn(
          "sticky top-0 z-[100]",
          isRootPage ? "bg-[#ffc95c]" : "bg-white",
          scroll && "bg-white shadow transition-colors duration-200 ease-in",
        )}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4 lg:justify-normal">
          {/* Left section: hamburger + logo */}
          <div className="flex items-center gap-1 lg:basis-1/4">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <HamburgerMenu className="w-6" />
            </button>
            <Logo />
          </div>

          {/* Center nav links */}
          <div className="hidden lg:flex lg:basis-2/4 lg:justify-center lg:gap-6">
            <NavLinks />
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2 lg:basis-1/4 lg:justify-end lg:gap-4">
            <WishlistIcon className="h-6 w-6 cursor-pointer hover:opacity-80" />

            {/* Cart */}
            <div className="relative">
              <CartIcon className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                1
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                2
              </span>
            </div>

            {/* Chat */}
            <div className="relative">
              <ChatIcon className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                42
              </span>
            </div>

            {/* Avatar or Auth
            {isAuthenticated ? (
              <div className="relative cursor-pointer">
                <img
                  src="/avatar-placeholder.png"
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
            ) : (
              <button
                onClick={() => router.push("/sign-in")}
                className="rounded-md bg-black px-4 py-1.5 text-sm font-medium text-white transition hover:bg-gray-900"
              >
                Sign In
              </button>
            )} */}

            {/* Sell Button */}
            <Link href={"/products/new-listing"}>
              <button className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700">
                List
              </button>
            </Link>
          </div>

          {/* Mobile Nav */}
          <NavMobile open={open} onClick={() => setOpen(false)} />
        </nav>
      </div>
    </>
  );
};

export default Navbar;
