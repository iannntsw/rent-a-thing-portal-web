"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getListingById, updateListing } from "@/lib/api/listings";
import Image from "next/image";
import CategoryDropdown from "@/components/ui/CategoryDropdown";
import Swal from "sweetalert2";
import { CATEGORIES } from "@/components/form/create-listing-form";

export default function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

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
        const parsedImages = (() => {
          try {
            return listing.images ? JSON.parse(listing.images) : [];
          } catch {
            return [];
          }
        })();

        setForm({
          title: listing.title,
          description: listing.description,
          pricePerDay: listing.pricePerDay,
          category: listing.category,
          location: listing.location,
          availableFrom: new Date(listing.availableFrom * 1000)
            .toISOString()
            .slice(0, 10),
          availableUntil: new Date(listing.availableUntil * 1000)
            .toISOString()
            .slice(0, 10),
          images: (() => {
            try {
              return listing.images ? JSON.parse(listing.images) : [];
            } catch {
              return [];
            }
          })(),
        });
        setExistingImages(parsedImages);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const base64NewImages = await Promise.all(
        newImageFiles.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }),
      );

      const combinedImages = [...existingImages, ...base64NewImages].slice(
        0,
        5,
      ); // Limit to 5

      await updateListing(id, {
        ...form,
        pricePerDay: parseFloat(form.pricePerDay),
        availableFrom: new Date(form.availableFrom).getTime() / 1000,
        availableUntil: new Date(form.availableUntil).getTime() / 1000,
        images: JSON.stringify(combinedImages),
      });
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Listing updated successfully.",
      });      router.push(`/products/${id}`);
    } catch (err: any) {
      console.error("Update failed", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.response?.data?.message || err.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Edit Listing</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Add New Images (Max 5 total)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);

              const oversized = files.find(
                (file) => file.size > 2 * 1024 * 1024,
              );
              if (oversized) {
                alert(
                  "One or more images are too large. Each must be under 2MB.",
                );
                return;
              }

              const previews = files.map((file) => URL.createObjectURL(file));
              setNewImageFiles(files);
              setNewImagePreviews(previews);
            }}
            className="block w-full rounded-md border border-gray-300 bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {existingImages.map((img, idx) => (
            <div key={`existing-${idx}`} className="relative h-20 w-20">
              <Image
                src={img}
                alt={`Existing image ${idx}`}
                fill
                className="rounded object-cover"
              />
              <button
                type="button"
                className="absolute -right-1 -top-1 rounded-full bg-white px-1 text-xs hover:bg-red-500 hover:text-white"
                onClick={() =>
                  setExistingImages((prev) => prev.filter((_, i) => i !== idx))
                }
              >
                ✕
              </button>
            </div>
          ))}

          {newImagePreviews.map((src, idx) => (
            <div key={`new-${idx}`} className="relative h-20 w-20">
              <Image
                src={src}
                alt={`New image ${idx}`}
                fill
                className="rounded object-cover"
              />
              <button
                type="button"
                className="absolute -right-1 -top-1 rounded-full bg-white px-1 text-xs hover:bg-red-500 hover:text-white"
                onClick={() => {
                  setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
                  setNewImagePreviews((prev) =>
                    prev.filter((_, i) => i !== idx),
                  );
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
        <label className="block text-sm font-medium text-gray-700">
          Price Per Day
        </label>
        <input
          name="pricePerDay"
          type="number"
          placeholder="Price per day"
          value={form.pricePerDay}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />

        <CategoryDropdown
          value={form.category}
          onChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
          categories={CATEGORIES}
        />

<label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
        <label className="block text-sm font-medium text-gray-700">
          Available From
        </label>
        <input
          name="availableFrom"
          type="date"
          value={form.availableFrom}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
        <label className="block text-sm font-medium text-gray-700">
          Available Until
        </label>
        <input
          name="availableUntil"
          type="date"
          value={form.availableUntil}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
        <button
          onClick={handleSubmit}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
