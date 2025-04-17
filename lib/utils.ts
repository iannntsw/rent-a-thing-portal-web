import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormatCurrencyProps = {
  currency?: string;
};

export const formatCurrency = (
  amount: number,
  options?: FormatCurrencyProps,
) => {
  const { currency = "USD" } = options || {};

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatRating = (ratings: number) => {
  return Array.from(
    { length: ratings >= 5 ? 5 : ratings },
    (_, idx) => idx + 1,
  );
};

function getAccessToken() {
  return localStorage.getItem('token'); 
}

export function authHeaders() {
  const token = getAccessToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function formatDateString(dateStr: string, locale = "en-SG", options?: Intl.DateTimeFormatOptions) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}
