"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_ENG_NAME, APP_NAME } from "@/lib/constants";
import { SERVICE_MENU } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, TentTree } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DialogMobileMenu() {
  const pathname = usePathname();

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="size-11 md:hidden"
          />
        }
      >
        <Menu aria-hidden="true" className="size-5" />
        <span className="sr-only">전체 메뉴 열기</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 font-paperlogy text-xl font-extrabold uppercase text-brand">
              <TentTree aria-hidden="true" className="size-8" />
              {APP_ENG_NAME}
            </div>
            <DialogTitle className="mt-2 font-paperlogy font-semibold text-xl">
              {APP_NAME} 전체 메뉴
            </DialogTitle>
          </div>
          <DialogDescription className="break-keep text-center font-anyvid text-sm leading-6">
            마라톤 대회를 다양한 스타일로 검색하고, 전국 마라톤 대회 정보를
            확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <nav aria-label="모바일 주요 메뉴">
          <div className="grid gap-2">
            {SERVICE_MENU.map((item) => {
              const Icon = item.icon;
              const isCurrent = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "relative flex h-11 items-center justify-center rounded-lg border bg-background px-10 font-anyvid text-sm transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isCurrent &&
                      "border-brand/30 bg-brand/10 font-semibold text-brand",
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className="absolute left-4 size-4"
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
