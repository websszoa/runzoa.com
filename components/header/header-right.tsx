"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Candy } from "lucide-react";

import HeaderSheet from "./header-sheet";
import HeaderUser from "./header-user";
import HeaderNav from "./header-nav";
import HeaderInfo from "./header-info";

export default function HeaderRight() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="메뉴 열기"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className="size-11 overflow-hidden rounded-full border border-transparent bg-brand p-0 text-white hover:border-brand hover:bg-white hover:text-brand"
          />
        }
      >
        <Candy className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent>
        <HeaderSheet />
        <HeaderUser />
        <HeaderNav onNavigate={() => setIsOpen(false)} />
        <HeaderInfo />
      </SheetContent>
    </Sheet>
  );
}
