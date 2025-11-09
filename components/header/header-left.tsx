import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function HeaderLeft() {
  return (
    <h1>
      <Link
        href={"/"}
        className="font-paperlogy text-2xl font-bold text-brand block"
      >
        {APP_NAME}
      </Link>
    </h1>
  );
}
