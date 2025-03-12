"use client";

// package
import { useEffect, useState } from "react";
import Link from "next/link";

// ui
import Logo from "@/ui/assets/logo";
import {
  CartIcon,
  HamburgerMenu,
  NotificationCount,
  SearchIcon,
  UserIcon,
  ChatIcon,
} from "@/ui/assets/svg";
import NavLinks from "@/ui/navbar/navLinks";
import NavMobile from "@/ui/navbar/navMobile";

// hooks
import { useRootContext } from "@/hooks/rootContext";

// lib
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const isRootPage = useRootContext();
  const [open, setOpen] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false); // Chat modal state

  const handleOnScroll = () => {
    setScroll(window.scrollY >= 32);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleOnScroll);
    return () => window.removeEventListener("scroll", handleOnScroll);
  }, []);

  // Click Handlers
  const handleSearchClick = () => {
    console.log("Search clicked! Open search modal here.");
  };

  const handleUserClick = () => {
    console.log("User icon clicked! Redirect to user profile.");
  };

  const handleCartClick = () => {
    console.log("Cart icon clicked! Redirect to shopping cart.");
  };

  return (
    <>
      {!open}
      <div
        className={cn(
          "sticky top-0 z-[100]",
          "bg-[#809671]",
          scroll &&
            "bg-[#809671] shadow transition-colors duration-200 ease-in",
        )}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4 lg:justify-normal">
          <div className="flex items-center gap-1 lg:basis-1/4">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <HamburgerMenu className="w-6" aria-label="Open menu" />
            </button>
            <Logo />
          </div>

          <div className="hidden basis-2/4 lg:block">
            <NavLinks />
          </div>

          <div className="flex items-center gap-1 lg:basis-1/4 lg:justify-end lg:gap-4">
            <SearchIcon
              className="hidden cursor-pointer lg:block"
              onClick={handleSearchClick}
              aria-label="Search"
            />
            <UserIcon
              className="hidden cursor-pointer lg:block"
              onClick={handleUserClick}
              aria-label="User Profile"
            />
            <CartIcon
              className="w-6 cursor-pointer"
              onClick={handleCartClick}
              aria-label="Shopping Cart"
            />

            {/* Chat Icon with Click Function */}
            <ChatIcon
              className="w-6 cursor-pointer text-white"
              onClick={() => setIsChatOpen(true)}
              aria-label="Open Chat"
            />

            <NotificationCount count={2} className={cn("text-white")} />
          </div>

          {/* Mobile navbar */}
          <NavMobile open={open} onClick={() => setOpen(false)} />
        </nav>
      </div>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Chat</h2>
            <p>Welcome to the chat!</p>
            <button
              className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
              onClick={() => setIsChatOpen(false)}
            >
              Close Chat
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
