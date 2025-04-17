"use client";

import React from "react";

type CategoryDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  categories?: string[];
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
        {categories?.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;
