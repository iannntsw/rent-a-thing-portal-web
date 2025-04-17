"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { deleteListing, getListingById } from "@/lib/api/listings";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createOrGetChat } from "@/lib/api/messages";
import Link from "next/link";
import { DialogHeader } from "@/components/ui/dialog/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog/dialog";
import { formatDateString } from "@/lib/utils";
import Swal from "sweetalert2";

interface ListingPageProps {
  params: {
    id: string;
  };
}

export default function ListingPage({ params }: ListingPageProps) {
  const router = useRouter();
  const listingId = params.id;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/sign-in");
    }
  }, [router]);

  const [listing, setListing] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 1,
    },
    mode: "snap",
  });

  const handleChatNow = async () => {
    const renterId = listing.user.userId;
    const renteeId = localStorage.getItem("userId");
    if (!renteeId) {
      alert("Please log in to start a chat.");
      return;
    }

    const { chatId } = await createOrGetChat(
      listing.listingId,
      renterId,
      renteeId,
      listing.title,
    );
    router.push(`/chat/${chatId}/${listingId}`);
  };

  const handleDelete = async () => {
    try {
      await deleteListing(listing.listingId);
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Listing has been successfully deleted.",
        confirmButtonColor: "#2C3725",
      });
      router.push("/");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err?.message,
      });
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      const data = await getListingById(params.id);
      if (!data) return notFound();
      setListing(data);
    };

    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        setCurrentUserId(userId);
      } catch (err) {
        console.error("Failed to parse user data");
      }
    }

    fetchListing();
  }, [params.id]);

  if (!listing) return null;

  let images: string[] = [];

  try {
    images = listing.images ? JSON.parse(listing.images) : [];
  } catch (err) {
    console.warn("Invalid images data", err);
    images = [];
  }
  const isOwner = currentUserId === listing.user?.userId;

  return (
    <div className="mx-auto max-w-6xl p-6 lg:grid lg:grid-cols-3 lg:gap-10">
      <div className="space-y-6 lg:col-span-2">
        <div className="relative mx-auto w-full max-w-xl">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={sliderRef}
            className="keen-slider h-[400px] w-full overflow-hidden rounded-md"
          >
            {images.map((src, index) => (
              <div
                key={index}
                className="keen-slider__slide flex items-center justify-center"
              >
                <Image
                  src={src}
                  alt={`Listing image ${index + 1}`}
                  width={400}
                  height={300}
                  className="rounded object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="mb-2 text-2xl font-bold">{listing.title}</h1>
          <p className="text-xl font-semibold text-red-600">
            S${listing.pricePerDay} / day
          </p>
        </div>

        <div className="space-y-2 border-t pt-4">
          <h2 className="text-lg font-semibold">Details</h2>
          <div className="space-y-1 text-sm text-gray-700">
            <h3>Category: {listing.category}</h3>
            <h3>Location: {listing.location}</h3>
            <h3>
              Available:{" "}
              {formatDateString(new Date(listing.availableFrom * 1000).toISOString())} -{" "}
              {formatDateString(new Date(listing.availableUntil * 1000).toISOString())}
            </h3>
            <h3>Description: {listing.description}</h3>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4 rounded-md border bg-white p-6 shadow-md lg:mt-0">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200">
            {listing.user?.profilePicture ? (
              <Image
                src={listing.user.profilePicture}
                alt="Profile"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
            ) : null}
          </div>
          <div>
            <Link
              href={`/profile/${listing.user?.userId}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              @{listing.user?.username}
            </Link>
            <p className="text-sm text-gray-600">
              Joined: {formatDateString(new Date(listing.user?.createdAt).toISOString())}
            </p>
          </div>
        </div>

        {isOwner ? (
          <div className="space-y-2">
            <button
              onClick={() => router.push(`/products/edit/${listing.listingId}`)}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Edit Listing
            </button>

            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Delete Listing
            </button>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>
                  Are you sure you want to delete this listing? This action
                  cannot be undone.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="rounded border px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    onClick={handleDelete}
                  >
                    Yes, Delete
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <button
            onClick={handleChatNow}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Chat Now
          </button>
        )}

        <div className="border-t pt-4">
          <p className="text-sm font-medium">Price</p>
          <p className="text-xl font-bold">S${listing.pricePerDay}</p>
        </div>

        <div className="space-y-2 border-t pt-4 text-xs text-gray-600">
          <p>
            <strong>Returns and refunds</strong>
            <br />
            Depends on the seller&apos;s decision. Not covered by Buyer
            Protection.
          </p>
          <p>
            <strong>Safety policy</strong>
            <br />
            Pay only at the meet-up. Transferring money directly to strangers
            puts you at risk of e-commerce scams.
          </p>
        </div>
      </div>
    </div>
  );
}
