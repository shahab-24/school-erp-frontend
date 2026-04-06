// components/students/StudentsFilters.tsx
"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, LayoutGrid, Table as TableIcon } from "lucide-react";
import { Button } from "../ui/button";

const CLASSES = Array.from({ length: 10 }, (_, i) => i + 1);
const SESSIONS = ["2024", "2025", "2026"];
const GENDERS = ["male", "female", "other"];
const STATUSES = ["active", "repeat", "passed", "transferred", "archived"];

interface StudentsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  classFilter: string;
  onClassFilterChange: (value: string) => void;
  sessionFilter: string;
  onSessionFilterChange: (value: string) => void;
  genderFilter: string;
  onGenderFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function StudentsFilters({
  search,
  onSearchChange,
  classFilter,
  onClassFilterChange,
  sessionFilter,
  onSessionFilterChange,
  genderFilter,
  onGenderFilterChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
}: StudentsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, UID, mobile..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={classFilter} onValueChange={onClassFilterChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {CLASSES.map((c) => (
              <SelectItem key={c} value={String(c)}>
                Class {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sessionFilter} onValueChange={onSessionFilterChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            {SESSIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={genderFilter} onValueChange={onGenderFilterChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            {GENDERS.map((g) => (
              <SelectItem key={g} value={g} className="capitalize">
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1 rounded-lg border p-1">
        <Button
          variant={viewMode === "table" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("table")}
          className="h-8 w-8 p-0"
        >
          <TableIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("grid")}
          className="h-8 w-8 p-0"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
