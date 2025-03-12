import Text from "@/ui/text";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/images/logo.png"
        alt="Rent-A-Thing Logo"
        width={40}
        height={40}
      />
      <div className="w-12" /> { /* spacing */ }
      <Text family="poppins" weight={500} className="md:text-lg text-[#FAFAFA]">
        Rent-A-Thing <span className="text-[#FAFAFA]">.</span>
      </Text>
    </div>
  );
}