const STORAGE_KEY = "wishlist";

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToWishlist(listingId: string) {
  const current = getWishlist();
  if (!current.includes(listingId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, listingId]));
  }
}

export function removeFromWishlist(listingId: string) {
  const current = getWishlist();
  const updated = current.filter((id) => id !== listingId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function isInWishlist(listingId: string): boolean {
  return getWishlist().includes(listingId);
}