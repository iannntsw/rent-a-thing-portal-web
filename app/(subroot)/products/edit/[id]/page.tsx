"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getListingById, updateListing } from "@/lib/api/listings";

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [form, setForm] = useState({
    title: "",
    description: "",
    pricePerDay: "",
    category: "",
    location: "",
    availableFrom: "",
    availableUntil: "",
    images: [],
  });

  useEffect(() => {
    const fetchListing = async () => {
      const listing = await getListingById(id);
      if (listing) {
        setForm({
          title: listing.title,
          description: listing.description,
          pricePerDay: listing.pricePerDay,
          category: listing.category,
          location: listing.location,
          availableFrom: new Date(listing.availableFrom * 1000).toISOString().slice(0, 10),
          availableUntil: new Date(listing.availableUntil * 1000).toISOString().slice(0, 10),
          images: JSON.parse(listing.images || "[]"),
        });
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await updateListing(id, {
        ...form,
        pricePerDay: parseFloat(form.pricePerDay),
        availableFrom: new Date(form.availableFrom).getTime() / 1000,
        availableUntil: new Date(form.availableUntil).getTime() / 1000,
        images: JSON.stringify(form.images),
      });
      alert("Listing updated successfully!");
      router.push(`/products/${id}`);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update listing.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <div className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          name="pricePerDay"
          type="number"
          placeholder="Price per day"
          value={form.pricePerDay}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          name="availableFrom"
          type="date"
          value={form.availableFrom}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          name="availableUntil"
          type="date"
          value={form.availableUntil}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
