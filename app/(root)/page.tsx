"use client";
import Link from "next/link";
import Image from "next/image";
import SectionLayout from "@/layouts/sectionLayout";
import Button from "@/ui/button";
import Heading from "@/ui/head";
import Text from "@/ui/text";
import CatalogSlider from "@/ui/slider/catalogSlider";
import * as ProductCard from "@/ui/card/productCard";
import {
  ArrowRightIcon,
  CallIcon,
  DeliveryIcon,
  LockIcon,
  MoneyIcon,
} from "@/ui/assets/svg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllListings } from "@/lib/api/listings";

export default function Home() {
  const router = useRouter();
  const [newArrivals, setNewArrivals] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/products?query=${encodeURIComponent(searchInput.trim())}`);

      setSearchInput("");
    }
  };

  const HOMEPAGE_CATEGORIES = [
    { label: "Home & Living", image: "home-living.png" },
    { label: "Electronics & Gadgets", image: "electronics-gadgets.png" },
    { label: "Clothing & Accessories", image: "clothing-accessories.png" },
    { label: "Vehicles", image: "vehicles.png" },
    { label: "Others", image: "others.png" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/sign-in");
    }

    fetchAllListings()
      .then((data) => {
        const arrivals = data.sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date },
          ) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setNewArrivals(arrivals);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
      });
  }, [router]);
  return (
    <>
      {/* Hero section */}
      <SectionLayout
        bg="bg-[#809671]"
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="flex max-w-xl flex-col items-center gap-6 px-6 text-center">
          <div className="lg:text-middle space-y-4 text-center">
            <Heading
              as="h1"
              intent="hero-section"
              className="text-4xl font-bold leading-snug tracking-tight md:text-5xl"
            >
              Why buy when you can
              <span className=" bg-gradient-to-r from-[#FEFCFF] to-[#FEFCFF] bg-clip-text  text-transparent ">
                {" "}
                rent?
              </span>
            </Heading>

            <Text className="lg:text-l ml-2 text-gray-700 md:text-lg">
              Rent what you need, when you need it — hassle-free.
            </Text>
          </div>

          <Link href="/sign-up">
            <Button
              fontSize="sm"
              className="rounded-lg bg-[#2c3725] px-14 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#576b4a] md:text-lg"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Search button*/}
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full max-w-md gap-2 pt-4"
        >
          <input
            type="text"
            placeholder="Search for items..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-grow rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#2c3725] focus:ring-[#2c3725]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#2c3725] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#576b4a]"
          >
            Search
          </button>
        </form>

        {/* Image content
        <div className="flex h-auto w-full items-end justify-center overflow-hidden lg:order-1">
          <Image
            src="/images/main.png"
            width={600}
            height={761}
            alt="family"
            className="w-full max-w-[360px] object-cover object-top lg:max-w-[420px] xl:max-w-[460px]"
          />
        </div> */}
      </SectionLayout>

      {/* Product section */}
      <SectionLayout>
        <div className="space-y-10 p-8">
          <Heading
            as="h2"
            intent="base-section"
            className="text-center md:text-left"
          >
            New Arrivals
          </Heading>

          {/* catalog product slider */}
          <CatalogSlider products={newArrivals} />
        </div>
      </SectionLayout>

      {/* Explore Categories section */}
      <SectionLayout>
        <div className="space-y-3 px-8 py-8 sm:space-y-4 md:space-y-6">
          <Heading
            as="h2"
            intent="base-section"
            className="text-center md:text-left"
          >
            Explore Categories
          </Heading>

          {/* View All Categories Link */}
          <div className="flex justify-start">
            <Link
              href="/categories"
              className="text-sm font-semibold text-[#2c3725] underline hover:text-[#576b4a]"
            >
              View all categories
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {HOMEPAGE_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={`/products?category=${encodeURIComponent(cat.label)}`}
                className="group rounded-lg transition hover:shadow-md"
              >
                <div className="relative h-40 w-full overflow-hidden ">
                  <Image
                    src={`/images/${cat.image}`}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-black group-hover:text-[#809671]">
                    {cat.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* Features section
      <SectionLayout>
        <div className="grid grid-cols-2 gap-x-2 gap-y-6 p-8 md:grid-cols-4 lg:gap-6 lg:py-10">
          <div className="space-y-4 bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
            <DeliveryIcon className="h-12 w-12" />
            <div className="space-y-1 md:space-y-2">
              <Text
                size="sm"
                weight={600}
                family="poppins"
                color="black/800"
                className="lg:text-xl"
              >
                Free Shipping
              </Text>
              <Text size="sm" color="gray">
                Order above $200
              </Text>
            </div>
          </div>
          <div className="space-y-4 bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
            <MoneyIcon className="h-12 w-12" />
            <div className="space-y-1 md:space-y-2">
              <Text
                size="sm"
                weight={600}
                family="poppins"
                color="black/800"
                className="lg:text-xl"
              >
                Money-back
              </Text>
              <Text size="sm" color="gray">
                30 days guarantee
              </Text>
            </div>
          </div>
          <div className="space-y-4 bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
            <LockIcon className="h-12 w-12" />
            <div className="space-y-1 md:space-y-2">
              <Text
                size="sm"
                weight={600}
                family="poppins"
                color="black/800"
                className="lg:text-xl"
              >
                Secure Payments
              </Text>
              <Text size="sm" color="gray">
                Secured by Striped
              </Text>
            </div>
          </div>
          <div className="space-y-4 bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
            <CallIcon className="h-12 w-12" />
            <div className="space-y-1 md:space-y-2">
              <Text
                size="sm"
                weight={600}
                family="poppins"
                color="black/800"
                className="lg:text-xl"
              >
                24/7 Support
              </Text>
              <Text size="sm" color="gray">
                Phone and Email support
              </Text>
            </div>
          </div>
        </div>
      </SectionLayout> */}

      {/* <SectionLayout>
        <div className="space-y-10 px-8 py-10">
          <div className="space-y-4 text-center">
            <Text weight={700} transform="uppercase" color="gray">
              newsfeed
            </Text>
            <Heading as="h2" intent="base-section">
              Instagram
            </Heading>
            <Text size="sm">
              Follow us on social media for more discount & promotions
            </Text>
          </div>
        </div>
      </SectionLayout> */}
    </>
  );
}
