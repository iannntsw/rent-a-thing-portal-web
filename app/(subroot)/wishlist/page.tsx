"use client";

import { useEffect, useState } from "react";
import { getWishlist } from "@/lib/wishlist";
import Link from "next/link";
import * as ProductCard from "@/ui/card/productCard";
import { getListingById } from "@/lib/api/listings";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  const fetchWishlist = async () => {
    const ids = getWishlist();
    const promises = ids.map((id) => getListingById(id));
    const listings = await Promise.all(promises);
    setWishlistItems(listings);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-left text-3xl font-semibold text-[#121212]">
          Your Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">No items in your wishlist yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {wishlistItems.map((product) => (
              <ProductCard.Root
                key={product.listingId}
                data={{
                  listingId: String(product.listingId),
                  title: product.title,
                  pricePerDay: product.pricePerDay,
                  description: product.description,
                  images: product.images,
                  rating: product.rating,
                }}
                className="w-full"
              >
                <ProductCard.Thumbnail>
                  <ProductCard.ThumbnailBadge>
                    <div className="space-y-1">
                      <ProductCard.Badge intent="default">
                        new
                      </ProductCard.Badge>
                    </div>
                    <ProductCard.WishlistButton
                      listingId={String(product.listingId)}
                      callback={fetchWishlist}
                    />
                  </ProductCard.ThumbnailBadge>

                  <Link href={`/products/${product.listingId}`}>
                    <ProductCard.Image />
                  </Link>
                </ProductCard.Thumbnail>

                <ProductCard.Content>
                  <ProductCard.Name />
                  <ProductCard.Price />
                </ProductCard.Content>
              </ProductCard.Root>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
