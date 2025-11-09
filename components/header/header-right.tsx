"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { menuItems } from "@/lib/menu";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Medal, Rabbit, ChevronRight } from "lucide-react";
import { APP_COPYRIGHT, APP_ENG_NAME, APP_NAME } from "@/lib/constants";
import DialogNotice from "../dialog/dialog-notice";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function HeaderRight() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isNoticeDialogOpen, setIsNoticeDialogOpen] = useState(false);

  const handleMenuClick = (href: string, type: string) => {
    if (type === "dialog") {
      setIsOpen(false);
      if (href === "#notice") {
        setIsNoticeDialogOpen(true);
      }
    } else if (type === "page") {
      setIsOpen(false);
      router.push(href);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-full border border-red-500 bg-red-500 text-white hover:bg-white hover:text-brand hover:border-red-600"
          >
            <Medal />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="border-b">
            <SheetTitle className="font-paperlogy text-xl uppercase font-bold text-brand mt-1">
              {APP_ENG_NAME}
            </SheetTitle>
            <SheetDescription className="sr-only">
              메뉴 및 사용자 정보를 확인할 수 있습니다.
            </SheetDescription>
          </SheetHeader>

          {/* 사용자 정보 섹션 */}
          <div className="p-4 border-b bg-gray-100 mt-[-16px]">
            <div className="text-center py-2">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Rabbit className="w-6 h-6 text-brand" />
                </div>
              </div>
              <h3 className="font-paperlogy font-bold text-lg text-gray-900">
                방가워요! 환영합니다!
              </h3>
              <p className="font-nanumNeo text-sm text-gray-500 truncate mb-2">
                마라톤 일정을 한눈에 확인해보세요!
              </p>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                <span className="font-nanumNeo text-xs text-blue-600">
                  마라톤 정보
                </span>
                <div className="w-2 h-2 bg-green-200 rounded-full ml-2"></div>
                <span className="font-nanumNeo text-xs text-green-600">
                  커뮤니티
                </span>
                <div className="w-2 h-2 bg-purple-200 rounded-full ml-2"></div>
                <span className="font-nanumNeo text-xs text-purple-600">
                  기록 관리
                </span>
              </div>
            </div>
          </div>

          {/* 메뉴 */}
          <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
            <div className="py-2">
              <nav className="space-y-1">
                <div className="py-2">
                  <nav className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => handleMenuClick(item.href, item.type)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-red-50 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                            <span className="font-nanumNeo text-sm text-gray-900 group-hover:text-red-600">
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </nav>
            </div>
          </ScrollArea>

          {/* 앱 정보 */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="text-center py-3 bg-gray-50">
              <p className="font-nanumNeo text-xs font-bold text-gray-500 mb-1">
                {APP_NAME} v1.0.0
              </p>
              <p className="font-nanumNeo text-xs text-gray-400">
                {APP_COPYRIGHT}
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <DialogNotice
        open={isNoticeDialogOpen}
        onOpenChange={setIsNoticeDialogOpen}
      />
    </>
  );
}
