"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Filter, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

type DateFilter = "today" | "week" | "month" | "all";
type TypeFilter = "requests" | "mentions" | "channel" | "workspace";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
  typeFilters: TypeFilter[];
  onTypeFiltersChange: (value: TypeFilter[]) => void;
}

export default function Header({
  search,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  typeFilters,
  onTypeFiltersChange,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  const activeCount = useMemo(() => {
    let count = 0;
    if (dateFilter !== "all") count += 1;
    count += typeFilters?.length;
    return count;
  }, [dateFilter, typeFilters]);

  const toggleType = (type: TypeFilter) => {
    onTypeFiltersChange(
      typeFilters.includes(type)
        ? typeFilters.filter((t) => t !== type)
        : [...typeFilters, type]
    );
  };

  const clearAll = () => {
    onDateFilterChange("all");
    onTypeFiltersChange([]);
  };

  return (
    // TODO: swap px-6/py-4 + border-b color for whatever your page container/header convention already is
    <div className="border-(--content-border) bg-(--sidebar-surface-1) flex items-center gap-3 border-b px-6 py-3">
      <div className="relative flex-1">
        <Search className="text-(--content-text-muted) pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notices"
          className="bg-(--content-surface) bg-white border-(--content-border) h-8 w-full pr-8 pl-9 text-sm"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="text-(--content-text-muted) hover:text-(--content-text) absolute top-1/2 right-3 -translate-y-1/2"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="transparent"
            size="sm"
            className={cn(
              "h-8 shrink-0 gap-1.5 px-3 text-sm bg_dark ",
              activeCount > 0 && "border-(--border-accent) text-(--text-accent)"
            )}
          >
            <Filter className="size-4" />
            Filters
            {activeCount > 0 && (
              <span className="bg-(--bg-accent) text-(--text-accent) ml-0.5 rounded-full px-1.5 text-[11px] leading-4">
                {activeCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-72 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-(--content-text-muted) mb-2 text-[11px] tracking-wide uppercase">
                Date
              </p>
              <div className="flex flex-col gap-2">
                {(
                  [
                    { value: "today", label: "Today" },
                    { value: "week", label: "This week" },
                    { value: "month", label: "This month" },
                    { value: "all", label: "All time" },
                  ] as { value: DateFilter; label: string }[]
                ).map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="date-filter"
                      checked={dateFilter === option.value}
                      onChange={() => onDateFilterChange(option.value)}
                      className="accent-(--text-accent) size-3.5"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-(--content-text-muted) mb-2 text-[11px] tracking-wide uppercase">
                Type
              </p>
              <div className="flex flex-col gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={typeFilters?.includes("requests")}
                    onChange={() => toggleType("requests")}
                    className="accent-(--text-accent) size-3.5"
                  />
                  Requests
                </label>
                {(["mentions", "channel", "workspace"] as TypeFilter[]).map((type) => (
                  <label
                    key={type}
                    className="text-(--content-text-muted) flex items-center gap-2 text-sm capitalize"
                  >
                    <input type="checkbox" disabled className="size-3.5" />
                    {type} <span className="text-[10px]">soon</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-(--content-border) mt-4 flex justify-end gap-2 border-t pt-3">
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAll}>
              Clear
            </Button>
            <Button size="sm" className="h-7 text-xs" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}