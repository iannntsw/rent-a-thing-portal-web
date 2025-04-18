"use client";

import { useKeenSlider } from "keen-slider/react";
import * as ProductCard from "@/ui/card/productCard";
import Link from "next/link";
import "keen-slider/keen-slider.min.css";

type CatalogSliderProps = {
  products: any[]; // ideally use a Product type/interface
};

export default function CatalogSlider({ products }: CatalogSliderProps) {
  const [slideRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: { spacing: 8, perView: 2 },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 16 },
        mode: "free-snap",
      },
      "(min-width: 1024px)": {
        slides: { perView: 4, spacing: 16 },
        mode: "free-snap",
      },
      "(min-width: 1280px)": {
        slides: { perView: 5, spacing: 16 },
        mode: "free-snap",
      },
    },
    renderMode: "performance",
  });

  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">No products available.</p>;
  }

  return (
    <div className="relative">
      <div ref={slideRef} className="keen-slider">
        {products.map((product) => (
          <div key={product.listingId} className="keen-slider__slide">
            <ProductCard.Root data={product}>
              <ProductCard.Thumbnail>
                <ProductCard.ThumbnailBadge>
                  <ProductCard.Badge>new</ProductCard.Badge>
                  <ProductCard.WishlistButton
                    listingId={product.listingId}
                    callback={() => {}}
                  />
                </ProductCard.ThumbnailBadge>

                <Link href={`/products/${product.listingId}`}>
                  <ProductCard.Image />
                </Link>
              </ProductCard.Thumbnail>

              <Link href={`/products/${product.listingId}`}>
                <ProductCard.Content>
                  {/* <ProductCard.Ratings /> */}
                  <ProductCard.Name />
                  <ProductCard.Price />
                </ProductCard.Content>
              </Link>
            </ProductCard.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
