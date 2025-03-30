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
} from "@/ui/assets/svg";
import NavLinks from "@/ui/navbar/navLinks";
import NavMobile from "@/ui/navbar/navMobile";
import PromoSection from "@/ui/promo";
import { useRouter } from "next/navigation";

// hooks
import { useRootContext } from "@/hooks/rootContext";

// lib
import { cn } from "@/lib/utils";

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
          <div className="flex items-center gap-1 lg:basis-1/4">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <HamburgerMenu className="w-6" />
            </button>

            <Logo />
          </div>

          <div className="hidden basis-2/4 lg:block">
            <NavLinks />
          </div>

          <div className="flex items-center gap-1 lg:basis-1/4 lg:justify-end lg:gap-4">
            <SearchIcon className="hidden lg:block" />
            <UserIcon className="hidden lg:block" />
            <CartIcon className="w-6" />
            <NotificationCount
              count={2}
              className={cn(isRootPage ? "text-[#FFAB00]" : "text-white")}
            />

            {/* ✅ Add Login Button */}
            {!isAuthenticated ? (
              <button
                onClick={() => router.push("/sign-in")}
                className="ml-2 rounded-md bg-black px-4 py-1.5 text-sm font-medium text-white transition hover:bg-gray-900"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsAuthenticated(false);
                  router.push("/sign-in");
                }}
                className="ml-2 rounded-md bg-red-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>

          {/* mobile navbar  */}
          <NavMobile open={open} onClick={() => setOpen(false)} />
        </nav>
      </div>
    </>
  );
};

export default Navbar;
