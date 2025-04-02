"use client";

// package
import Link from "next/link";
import Image from "next/image";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
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

// data
import products from "@/data/product.json";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllListings } from "@/lib/api/listings";

export default function Home() {
  const router = useRouter();
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/sign-in");
    }

    fetchAllListings()
      .then((data) => {
        const arrivals = data
          .sort(
            (a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        setNewArrivals(arrivals);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
      });
  }, []);
  return (
    <>
      {/* Hero section */}
      <SectionLayout
        bg="bg-[#ffc95c]"
        className="flex flex-col items-center justify-between lg:grid lg:grid-cols-2 lg:pt-8"
      >
        {/* Text content */}
        <div className="flex flex-col items-center gap-6 p-10 sm:max-w-[600px] md:max-w-[600px] md:py-20 lg:order-2 lg:max-w-none lg:items-start lg:p-0">
          <div className="space-y-4 text-center lg:text-left">
            <Heading
              as="h1"
              intent="hero-section"
              className="text-4xl font-bold leading-tight"
            >
              Why buy when you can
              <span className="bg-gradient-to-r from-[#377DFF] to-[#00C2FF] bg-clip-text text-transparent">
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
              className="rounded-lg bg-[#377DFF] px-14 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#0057D9] md:text-lg"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Image content */}
        <div className="flex h-auto w-full items-end justify-center overflow-hidden lg:order-1">
          <Image
            src="/images/main.png"
            width={600}
            height={761}
            alt="nigga-listening-music"
            className="w-full max-w-[360px] object-cover object-top lg:max-w-[420px] xl:max-w-[460px]"
          />
        </div>
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
          <CatalogSlider products={newArrivals}/>
        </div>
      </SectionLayout>

      {/* Shop collection section */}
      <SectionLayout>
        <div className="space-y-4 px-8 py-10 sm:space-y-8 md:space-y-12">
          <Heading
            as="h2"
            intent="base-section"
            className="text-center md:text-left"
          >
            Shop Collection
          </Heading>

          <div className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 lg:h-[560px]">
            {/* Main collection */}
            <div className="relative aspect-[0.8/1] min-h-[377px] w-full min-w-[311px] bg-[#F3F5F7] p-8 sm:row-span-2 sm:aspect-auto sm:h-full sm:min-w-0">
              <div className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden">
                <Image
                  src="/images/sumplekuping-2.png"
                  width={262}
                  height={349}
                  alt="background collection"
                  className="aspect-[0.75/1] w-[80%] -translate-y-[10%] object-center md:w-[60%]"
                />
              </div>

              <div className="relative flex h-full flex-col justify-end gap-2">
                <Heading as="h3" intent="collection-card">
                  Headband
                </Heading>
                <Link href="/shop" className="w-fit">
                  <span className="flex w-fit items-center gap-1 border-b border-[#121212]">
                    Collection{" "}
                    <ArrowRightIcon stroke="#121212" className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Another collection */}
            <div className="relative aspect-[1/0.5] min-h-[180px] w-full min-w-[311px] bg-[#F3F5F7] p-8 sm:aspect-auto sm:h-full sm:min-w-0">
              <div className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden">
                <Image
                  src="/images/sumplekuping-4.png"
                  width={262}
                  height={349}
                  alt="background collection"
                  className="aspect-[0.75/1] w-[50%] translate-x-1/2 md:w-[40%]"
                />
              </div>

              <div className="relative flex h-full flex-col justify-end gap-2">
                <Heading as="h3" intent="collection-card">
                  Earbuds
                </Heading>
                <Link href="/shop" className="w-fit">
                  <span className="flex w-fit items-center gap-1 border-b border-[#121212]">
                    Collection{" "}
                    <ArrowRightIcon stroke="#121212" className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Another collection */}
            <div className="relative aspect-[1/0.5] min-h-[180px] w-full min-w-[311px] bg-[#F3F5F7] p-8 sm:aspect-auto sm:h-full sm:min-w-0">
              <div className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden">
                <Image
                  src="/images/sumplekuping-5.png"
                  width={262}
                  height={349}
                  alt="background collection"
                  className="aspect-[0.75/1] w-[50%] translate-x-1/2 md:w-[40%]"
                />
              </div>

              <div className="relative flex h-full flex-col justify-end gap-2">
                <Heading as="h3" intent="collection-card">
                  Accessories
                </Heading>
                <Link href="/shop" className="w-fit">
                  <span className="flex w-fit items-center gap-1 border-b border-[#121212]">
                    Collection{" "}
                    <ArrowRightIcon stroke="#121212" className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SectionLayout>


      {/* Features section */}
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
      </SectionLayout>

      {/* Newsfeed section */}
      <SectionLayout>
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
            <Text size="xl" weight={500} family="poppins" color="gray">
              @kupingplug_official
            </Text>
          </div>
        </div>
      </SectionLayout>
    </>
  );
}
