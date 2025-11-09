import { Home, Newspaper, Rat, Compass, Drama } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  type: "page" | "dialog";
}

// 오른쪽 버튼 메뉴
export const menuItems: MenuItem[] = [
  { icon: Home, label: "홈", href: "/", type: "page" },
  { icon: Newspaper, label: "공지사항", href: "#notice", type: "dialog" },
  { icon: Rat, label: "문의하기", href: "/contact", type: "page" },
  { icon: Compass, label: "이용약관", href: "/terms", type: "page" },
  { icon: Drama, label: "개인정보취급방침", href: "/privacy", type: "page" },
];
