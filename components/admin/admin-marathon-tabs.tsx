"use client";

import { List, Plus } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MarathonTab = "list" | "create";

export default function AdminMarathonTabs({
  current,
  onChange,
}: {
  current: MarathonTab;
  onChange: (value: MarathonTab) => void;
}) {
  return (
    <Tabs
      value={current}
      onValueChange={(value) => onChange(value as MarathonTab)}
    >
      <TabsList variant="line" aria-label="마라톤 관리 메뉴">
        <TabsTrigger value="list" className="min-w-20 font-anyvid">
          <List className="size-4" /> 목록
        </TabsTrigger>
        <TabsTrigger value="create" className="min-w-20 font-anyvid">
          <Plus className="size-4" /> 등록
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
