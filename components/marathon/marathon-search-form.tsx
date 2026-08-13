"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MarathonSearchFormProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch?: () => void;
};

export default function MarathonSearchForm({
  value,
  onValueChange,
  onSearch,
}: MarathonSearchFormProps) {
  return (
    <section
      aria-label="마라톤 대회 검색"
      className="border-y bg-background/80 backdrop-blur"
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <form
          role="search"
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch?.();
          }}
        >
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              name="marathon-query"
              value={value}
              onChange={(event) => onValueChange?.(event.target.value)}
              aria-label="마라톤 대회 검색어"
              placeholder="대회명, 지역 또는 장소로 검색해보세요"
              className="h-13 rounded-lg bg-background pr-4 pl-12 font-anyvid"
            />
          </div>
          <Button
            type="submit"
            size="icon-lg"
            aria-label="대회 검색하기"
            className="size-13 shrink-0 rounded-full bg-brand text-white hover:bg-brand/85"
          >
            <Search aria-hidden="true" />
          </Button>
        </form>
      </div>
    </section>
  );
}
