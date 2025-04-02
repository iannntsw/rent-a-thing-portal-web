// package
import { createContext, useContext } from "react";

// ui
import { type ProductDataProps } from "@/ui/card/productCard";

const ProductCardContext = createContext<{
  image: { src: string; alt: string };
  name: string;
  price: number;
  rating: number;
  description: string;
} | null>(null);

type ProductCardProviderProps = React.PropsWithChildren<ProductDataProps>;

export const ProductCardProvider = ({
  children,
  data,
}: ProductCardProviderProps) => {
  // Parse image (JSON string of base64 strings)
  let parsedImages: string[] = [];
  try {
    parsedImages = JSON.parse(data.images || "[]");
  } catch (e) {
    console.warn("Failed to parse images", e);
  }

  const imageSrc = parsedImages.length > 0 ? parsedImages[0] : "/fallback.png";

  const contextValue = {
    image: {
      src: imageSrc,
      alt: data.title || "Listing image",
    },
    name: data.title,
    price: data.pricePerDay,
    rating: data.rating || 5, // default if undefined
    description: data.description,
  };

  return (
    <ProductCardContext.Provider value={contextValue}>
      {children}
    </ProductCardContext.Provider>
  );
};

export const useProductCardContext = () => {
  const data = useContext(ProductCardContext);
  if (!data) throw new Error("ProductCardProvider is missing.");
  return data;
};
