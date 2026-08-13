"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { APP_COPYRIGHT, APP_ENG_NAME, APP_NAME } from "@/lib/constants";
import { SERVICE_MENU, SHEET_NAVIGATION } from "@/lib/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Candy, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import DialogLogin from "@/components/dialog/dialog-login";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      id="site-header"
      className="sticky top-0 z-40 w-full border-b border-gray-400/20 bg-background"
    >
      <div className="mx-auto flex h-14 sm:h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:gap-10 lg:px-8">
        <Link
          href="/"
          aria-label="런조아 홈으로"
          className="flex items-center font-paperlogy text-xl sm:text-2xl font-black uppercase leading-none text-brand"
        >
          {APP_ENG_NAME}
        </Link>

        <nav
          className="hidden items-center gap-1 font-anyvid text-[13px] md:flex"
          aria-label="주요 메뉴"
        >
          {SERVICE_MENU.map((item) => {
            const isCurrent = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isCurrent && "bg-muted font-semibold",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

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
                className="ml-auto size-9 sm:size-11 overflow-hidden rounded-full border border-transparent bg-brand p-0 text-white hover:border-brand hover:bg-white hover:text-brand"
              />
            }
          >
            <Candy className="size-4 sm:size-5" aria-hidden="true" />
          </SheetTrigger>

          <SheetContent>
            <SheetHeader className="relative z-20 border-b border-brand/10 bg-popover">
              <SheetTitle className="flex items-center gap-2 font-paperlogy text-xl font-semibold uppercase text-brand">
                <span>{APP_NAME}</span>
                <DialogLogin compact />
              </SheetTitle>
              <SheetDescription className="sr-only">
                메뉴와 서비스 정보를 확인할 수 있습니다.
              </SheetDescription>
            </SheetHeader>

            <div className="relative z-10 -mt-4 border-b border-brand/5 bg-brand/5 p-4">
              <div className="relative py-2 text-center">
                <div className="mb-2 flex justify-center">
                  <Avatar className="size-16 border-2 border-brand/10">
                    <AvatarImage
                      src="/face/face01.webp"
                      alt="프로필 이미지"
                      className="bg-brand/10"
                    />
                    <AvatarFallback className="bg-brand/10 pt-1 font-paperlogy text-3xl text-brand">
                      R
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="mb-1 font-paperlogy text-lg text-gray-900">
                  환영합니다!
                </p>
                <p className="truncate font-anyvid text-sm text-muted-foreground">
                  런조아의 다양한 대회 정보를 확인해보세요.
                </p>
              </div>
            </div>

            <ScrollArea className="relative z-0 -mt-2 mb-12 h-[calc(100vh-400px)] flex-1">
              <nav aria-label="사이드 메뉴" className="mt-1 space-y-1">
                {SHEET_NAVIGATION.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    {groupIndex > 0 && <Separator className="my-3" />}
                    {group.map((item) => {
                      const Icon = item.icon;
                      const isCurrent = pathname === item.href.split("?")[0];

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch
                          aria-current={isCurrent ? "page" : undefined}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "mx-2 flex items-center justify-between gap-3 rounded-md px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isCurrent
                              ? "bg-brand/5 text-brand"
                              : "text-muted-foreground hover:bg-brand/10 hover:text-brand",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <Icon
                              className="size-4 shrink-0"
                              aria-hidden="true"
                            />
                            <span className="font-anyvid">{item.label}</span>
                          </span>
                          <ChevronRight className="size-4" aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </ScrollArea>

            <div className="absolute inset-x-0 bottom-0 bg-gray-50 py-3 text-center">
              <p className="mb-1 font-nanumNeo text-xs text-gray-500">
                {APP_NAME} v2.00
              </p>
              <p className="font-nanum text-xs text-gray-500">
                made with love and care.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
