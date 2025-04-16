"use client";

import SectionLayout from "@/layouts/sectionLayout";
import Heading from "@/ui/head";
import Text from "@/ui/text";
import CatalogProduct from "@/app/(subroot)/categories/catalogProduct";

export default function CategoriesPage() {
  return (
    <SectionLayout>
      <div className="px-8">
        <div className="relative flex h-[300px] flex-col items-center justify-center gap-4 bg-[#F3F5F7] text-center">
          <Text
            size="sm"
            color="gray"
            weight={500}
            className="flex items-center gap-1"
          >
            Home <span className="text-gray-400">/</span> Categories
          </Text>

          <Heading as="h1" intent="shop-page">
            Browse by Category
          </Heading>

          <Text className="max-w-xl text-gray-600 lg:text-lg">
            Discover items across different categories for rent. Choose a
            category to explore available listings.
          </Text>
        </div>

        {/* CATEGORY CARDS */}
        <CatalogProduct />
      </div>
    </SectionLayout>
  );
}
