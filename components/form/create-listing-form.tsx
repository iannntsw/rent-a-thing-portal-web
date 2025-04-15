"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input";
import { cn } from "@/lib/utils";
import { createListing } from "@/lib/api/listings";
import Image from "next/image";

interface RentFormProps {
  userEmail: string;
}

const RentForm: React.FC<RentFormProps> = ({ userEmail }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    pricePerDay: 0,
    availableFrom: "",
    availableUntil: "",
    status: "Available",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pricePerDay" ? Number(value) : value,
    }));
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    const oversized = files.find((file) => file.size > 2 * 1024 * 1024);
    if (oversized) {
      alert("One or more images are too large. Each must be under 2MB.");
      return;
    }

    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const base64Images = await Promise.all(
      imageFiles.map((file) => {
        const reader = new FileReader();
        return new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }),
    );

    const payload = {
      ...formData,
      images: JSON.stringify(base64Images),
      availableFrom: Math.floor(
        new Date(formData.availableFrom).getTime() / 1000,
      ),
      availableUntil: Math.floor(
        new Date(formData.availableUntil).getTime() / 1000,
      ),
    };

    try {
      await createListing(userEmail, payload);
      alert("Item listed successfully!");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      alert(
        `Failed: ${err.message || "Something went wrong. Please try again."}`,
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-6 rounded-md border p-6 shadow-sm"
    >
      <h2 className="text-2xl font-semibold">List Your Item for Rent</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Item Title
        </label>
        <Input
          name="title"
          placeholder="Item Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Item Description
        </label>
        <textarea
          name="description"
          placeholder="Item Description"
          value={formData.description}
          onChange={handleChange}
          required
          className={cn(
            "w-full rounded-md border border-[#CBCBCB] px-4 py-2 font-inter text-base text-[#6C7275] placeholder:text-[#6C7275] focus:text-[#141718] focus:outline-none",
          )}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <Input
          name="category"
          placeholder="e.g. Chair, Electronics"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <Input
          name="location"
          placeholder="e.g. NUS, Clementi"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Price Per Day (SGD)
        </label>
        <Input
          name="pricePerDay"
          type="number"
          placeholder="Enter amount"
          value={formData.pricePerDay}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Available From
          </label>
          <Input
            name="availableFrom"
            type="date"
            value={formData.availableFrom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Available Until
          </label>
          <Input
            name="availableUntil"
            type="date"
            value={formData.availableUntil}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Images (Max 5)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="block w-full rounded-md border border-[#CBCBCB] px-4 py-2 text-sm text-white"
        />
        <p className="text-sm text-gray-500">
          {imageFiles.length} file{imageFiles.length !== 1 && "s"} selected
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {imagePreviews.map((src, idx) => (
            <div key={idx} className="relative h-20 w-20">
              <Image
                src={src}
                alt={`Preview ${idx + 1}`}
                width={80}
                height={80}
                className="h-full w-full rounded border border-gray-300 object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-1 text-xs text-gray-700 shadow hover:bg-red-500 hover:text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
      >
        List Item
      </button>
    </form>
  );
};

export default RentForm;
