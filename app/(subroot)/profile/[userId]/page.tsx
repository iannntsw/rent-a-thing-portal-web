"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import { useEffect, useState } from "react";
import { getUserById, updateUserProfile } from "@/lib/api/user";
import Link from "next/link";
import Image from "next/image";
import { formatDateString } from "@/lib/utils";
import Swal from "sweetalert2";

export default function ViewProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;
  const [user, setUser] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    profilePicture: "",
    phoneNumber: "",
  });
  const [previewImage, setPreviewImage] = useState<string>("");

  const loggedInUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const userData = await getUserById(userId);
          setUser(userData);
          setEditForm({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            username: userData.username || "",
            email: userData.email || "",
            profilePicture: userData.profilePicture || "",
            phoneNumber: userData.phoneNumber || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    setShowEditDialog(false);
    try {
      await updateUserProfile(userId, editForm);
      const updated = await getUserById(userId);
      setUser(updated);

      await Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated.",
      });
    } catch (err: any) {
      console.error("Failed to update profile", err);
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          err?.message ||
          "Error updating profile. Please check for duplicate email, username, or phone number.",
      });
    }
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-[#121212]">Profile</h1>
          {userId === loggedInUserId && (
            <button
              onClick={() => setShowEditDialog(true)}
              className="rounded-md bg-[#2C3725] px-4 py-2 text-white hover:bg-[#1f251a]"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="mb-8 flex items-center gap-6">
          <Image
            src={user.profilePicture || "/images/default-user.png"}
            alt="Profile"
            className="h-24 w-24 rounded-full border object-cover"
            width={96}
            height={96}
            unoptimized
          />
          <div>
            <h3 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phoneNumber}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {formatDateString(new Date(user.createdAt).toISOString())}
          </p>
        </div>

        {user.listings?.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-semibold">Listings</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {user.listings.map((listing: any) => (
                <Link
                  key={listing.listingId}
                  href={`/products/${listing.listingId}`}
                  className="rounded border p-4 transition hover:shadow-md"
                >
                  <Image
                    src={(() => {
                      try {
                        const parsed = JSON.parse(listing.images || "[]");
                        return parsed?.[0] || "/default-product.png";
                      } catch {
                        return "/default-product.png";
                      }
                    })()}
                    alt={listing.title}
                    className="mb-2 h-32 w-full rounded object-cover"
                    width={300}
                    height={120}
                    unoptimized
                  />
                  <h4 className="text-sm font-medium">{listing.title}</h4>
                  <p className="text-xs text-gray-500">
                    ${listing.pricePerDay}/day
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {user.receivedReviews?.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-semibold">
              Reviews (Average Rating: {user.averageRating} ⭐)
            </h2>
            <div className="space-y-4">
              {user.receivedReviews.map((review: any) => (
                <div
                  key={review.reviewId}
                  className="rounded border p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      Rating: {review.rating}⭐
                    </span>
                    <span className="text-gray-500">
                      {formatDateString(
                        new Date(review.createdAt).toISOString(),
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    {review.reviewText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Preview"
                  className="mx-auto h-24 w-24 rounded-full border object-cover"
                  width={96}
                  height={96}
                  unoptimized
                />
              )}

              {[
                {
                  label: "Profile Picture",
                  type: "file",
                  key: "profilePicture",
                },
                { label: "First Name", type: "text", key: "firstName" },
                { label: "Last Name", type: "text", key: "lastName" },
                { label: "Username", type: "text", key: "username" },
                { label: "Email", type: "email", key: "email" },
                { label: "Phone Number", type: "tel", key: "phoneNumber" },
              ].map(({ label, type, key }) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium">
                    {label}
                  </label>
                  {type === "file" ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await toBase64(file);
                          setEditForm((prev) => ({
                            ...prev,
                            profilePicture: base64,
                          }));
                          setPreviewImage(base64);
                        }
                      }}
                      className="w-full rounded border p-2 text-sm"
                    />
                  ) : (
                    <input
                      type={type}
                      value={editForm[key as keyof typeof editForm]}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [key]: e.target.value })
                      }
                      className="w-full rounded border p-2 text-sm"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-[#2C3725] px-4 py-2 text-sm text-white hover:bg-[#1f251a]"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
