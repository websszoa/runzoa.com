import { SERVICE_MENU } from "@/lib/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

import HeaderNavLink from "./header-nav-link";

interface HeaderNavProps {
  onNavigate: () => void;
}

export default function HeaderNav({ onNavigate }: HeaderNavProps) {
  return (
    <ScrollArea className="-mt-3 mb-12 h-[calc(100vh-400px)] flex-1">
      <nav aria-label="사이드 메뉴" className="mt-1 space-y-1">
        {SERVICE_MENU.map((item) => (
          <HeaderNavLink
            key={item.href}
            item={item}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </ScrollArea>
  );
}
