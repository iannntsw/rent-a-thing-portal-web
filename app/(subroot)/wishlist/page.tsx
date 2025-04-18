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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {wishlistItems.length === 0 ? (
          <p>No items in your wishlist yet.</p>
        ) : (
          wishlistItems.map((product) => (
                <ProductCard.Root
                  key={product.listingId}
                  data={{

                    listingId: String(product.listingId),
                    title: product.title,
                    pricePerDay: product.pricePerDay,
                    description: product.description,
                    images: product.images, // wrap in array and stringify
                    rating: product.rating,
                  }}
                  className="w-[231px] flex-none"
                >
                  <ProductCard.Thumbnail>
                    <ProductCard.ThumbnailBadge>
                      <div className="space-y-1">
                        <ProductCard.Badge intent="default">new</ProductCard.Badge> 
                      </div>
                      <ProductCard.WishlistButton listingId={String(product.listingId)} callback={fetchWishlist}/>
                    </ProductCard.ThumbnailBadge>
      
                    <Link href={`/products/${product.listingId}`}> 
                      <ProductCard.Image />
                    </Link>
                  </ProductCard.Thumbnail>
      
                  <ProductCard.Content>
                    <ProductCard.Ratings />
                    <ProductCard.Name />
                    <ProductCard.Price />
                  </ProductCard.Content>
                </ProductCard.Root>
              
          ))
        )}
      </div>
    </div>
  );
}