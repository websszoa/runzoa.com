import Link from "next/link";
import { APP_ENG_NAME } from "@/lib/constants";

export default function HeaderLeft() {
  return (
    <Link
      href="/"
      aria-label="런조아 홈으로"
      className="flex h-11 items-center text-2xl uppercase font-paperlogy font-black text-brand leading-none"
    >
      {APP_ENG_NAME}
    </Link>
  );
}
