"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getUserById, updateUserProfile } from "@/lib/api/user";
import Link from "next/link";
import Image from "next/image";

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
    try {
      await updateUserProfile(userId, editForm);
      setShowEditDialog(false);
      const updated = await getUserById(userId);
      setUser(updated);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert(
        "Error updating profile. Please check for duplicate email, username, or phone number.",
      );
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
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        {userId === loggedInUserId && (
          <button
            onClick={() => setShowEditDialog(true)}
            className="rounded bg-[#2C3725] px-4 py-2 text-white hover:bg-[#1f251a]"
          >
            Edit Profile
          </button>
        )}
      </div>
      <div className="mb-6 flex items-center gap-4">
        <Image
          src={user.profilePicture || "/default-avatar.png"}
          alt="Profile"
          className="h-24 w-24 rounded-full border object-cover"
          width={80}
          height={80}
        />
        <div>
          <h2 className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600">@{user.username}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phoneNumber}
        </p>
        <p>
          <strong>Joined:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      {user.listings?.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Listings</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {user.listings.map((listing: any) => (
              <div
                key={listing.listingId}
                className="rounded border p-4 shadow transition hover:shadow-md"
              >
                <Link
                  href={`/products/${listing.listingId}`}
                  className="flex justify-center"
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
                    className="mb-2 h-32 w-32 rounded object-cover"
                    width={80}
                    height={80}
                  />
                </Link>
                <h3 className="text-lg font-medium">{listing.title}</h3>
                <p className="text-sm text-gray-600">
                  ${listing.pricePerDay}/day
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {user.receivedReviews?.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
          <div className="space-y-4">
            {user.receivedReviews.map((review: any) => (
              <div
                key={review.reviewId}
                className="rounded border p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Rating: {review.rating}⭐</p>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
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
          <div className="space-y-3">
            {previewImage && (
              <Image
                src={previewImage}
                alt="Profile Preview"
                className="mx-auto mb-2 h-24 w-24 rounded-full border object-cover"
                width={80}
                height={80}
              />
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Profile Picture
              </label>
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
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) =>
                  setEditForm({ ...editForm, firstName: e.target.value })
                }
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) =>
                  setEditForm({ ...editForm, lastName: e.target.value })
                }
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Username</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                value={editForm.phoneNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, phoneNumber: e.target.value })
                }
                className="w-full rounded border p-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="rounded border px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-[#2C3725] px-4 py-2 text-white hover:bg-[#1f251a]"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
