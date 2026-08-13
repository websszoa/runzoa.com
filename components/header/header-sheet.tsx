import { APP_NAME } from "@/lib/constants";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function HeaderSheet() {
  return (
    <>
      <SheetHeader className="border-b border-brand/10">
        <SheetTitle className="font-paperlogy font-semibold text-xl uppercase text-brand flex items-center gap-2">
          {APP_NAME}
        </SheetTitle>
        <SheetDescription className="sr-only">
          메뉴와 서비스 정보를 확인할 수 있습니다.
        </SheetDescription>
      </SheetHeader>
    </>
  );
}
