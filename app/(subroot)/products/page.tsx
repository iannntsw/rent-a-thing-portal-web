"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllListings } from "@/lib/api/listings";
import CatalogSlider from "@/ui/slider/catalogSlider";
import Heading from "@/ui/head";

// Define the CategoryDropdown component inline to avoid path issues
type CategoryDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  onChange,
  categories,
}) => {
  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c3725]"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

type Listing = {
  listingId: string;
  title: string;
  pricePerDay: number;
  createdAt: string;
  images?: string;
  category?: string;
};

type SortOption = "recent" | "price-low" | "price-high";

export default function ProductListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const query = searchParams.get("query") || "";
  const sort = (searchParams.get("sort") as SortOption) || "recent";

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);

  // Handle category change
  const handleCategoryChange = (selectedCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (selectedSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", selectedSort);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await fetchAllListings();

        let filtered = all;

        // Filter by category
        if (category) {
          filtered = filtered.filter(
            (item: Listing) =>
              item.category?.toLowerCase() === category.toLowerCase(),
          );
        }

        // Filter by search query
        if (query) {
          filtered = filtered.filter((item: Listing) =>
            item.title.toLowerCase().includes(query.toLowerCase()),
          );
        }

        // Sort listings
        const sorted = [...filtered].sort((a, b) => {
          if (sort === "recent") {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else if (sort === "price-low") {
            return a.pricePerDay - b.pricePerDay;
          } else if (sort === "price-high") {
            return b.pricePerDay - a.pricePerDay;
          }
          return 0;
        });

        setListings(sorted);
      } catch (err) {
        console.error("Failed to fetch listings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, query, sort]);

  const CATEGORIES = [
    "Home & Living",
    "Electronics & Gadgets",
    "Clothing & Accessories",
    "Vehicles",
    "Media & Production",
    "Events & Party",
    "Tools & Equipment",
    "Kids & Baby",
    "Outdoor & Sports",
    "Others",
  ];

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Heading
          as="h2"
          intent="base-section"
          className="mb-6 text-center md:text-left"
        >
          {query && category
            ? `Results for "${query}" in "${category}"`
            : query
              ? `Results for "${query}"`
              : category
                ? `Items in "${category}"`
                : "All Listings"}
        </Heading>

        <div className="mb-8 flex flex-wrap items-end gap-4">
          {/* Filter Controls in a row */}
          <div className="flex flex-wrap gap-4">
            {/* Category Dropdown */}
            <div className="w-40 sm:w-48">
              <CategoryDropdown
                value={category || ""}
                onChange={handleCategoryChange}
                categories={CATEGORIES}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="w-40 sm:w-48">
              <label className="mb-1 block text-sm font-medium">Sort By</label>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c3725]"
              >
                <option value="recent">Most Recent</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : listings.length === 0 ? (
          <p>No listings found.</p>
        ) : (
          <CatalogSlider products={listings} />
        )}
      </div>
    </div>
  );
}
