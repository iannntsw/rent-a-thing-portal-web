"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import * as ProductCard from "@/ui/card/productCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import "keen-slider/keen-slider.min.css";

type CatalogSliderProps = {
  products: any[]; // ideally use a Product type/interface
};

export default function CatalogSlider({ products }: CatalogSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [slideRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
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
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <div ref={slideRef} className="keen-slider">
        {products.map((product) => (
          <div key={product.listingId} className="keen-slider__slide">
            <ProductCard.Root data={product}>
              <ProductCard.Thumbnail>
                <ProductCard.ThumbnailBadge>
                  <ProductCard.Badge>new</ProductCard.Badge>
                  <ProductCard.WishlistButton />
                </ProductCard.ThumbnailBadge>

                <Link href={`/products/${product.listingId}`}>
                  <ProductCard.Image />
                </Link>
              </ProductCard.Thumbnail>

              <Link href={`/products/${product.listingId}`}>
                <ProductCard.Content>
                  <ProductCard.Ratings />
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
