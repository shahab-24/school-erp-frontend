// components/students/StudentsGrid.tsx
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Student } from "@/types/student.types";

const STATUS_COLORS = {
  active: "bg-green-500",
  repeat: "bg-yellow-500",
  passed: "bg-blue-500",
  transferred: "bg-purple-500",
  archived: "bg-gray-500",
} as const;

interface StudentsGridProps {
  students: Student[];
  isLoading?: boolean;
}

export function StudentsGrid({ students, isLoading }: StudentsGridProps) {
  if (isLoading) {
    return <StudentsGridSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {students.map((student) => (
        <Link
          key={student.studentUid}
          href={`/dashboard/students/${student.studentUid}`}
          className="block transition-transform hover:scale-[1.02]"
        >
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {student.name?.en?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{student.name?.en}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {student.name?.bn}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <Badge
                className={`${
                  STATUS_COLORS[student.status as keyof typeof STATUS_COLORS] ||
                  "bg-gray-500"
                } text-white`}
              >
                {student.status}
              </Badge>
            </CardContent>
            <CardFooter className="grid grid-cols-3 gap-2 pt-2 text-center text-sm">
              <div>
                <div className="font-mono text-lg font-semibold">
                  {student.current?.class}
                </div>
                <div className="text-xs text-muted-foreground">Class</div>
              </div>
              <div>
                <div className="font-mono text-lg font-semibold">
                  {student.current?.roll}
                </div>
                <div className="text-xs text-muted-foreground">Roll</div>
              </div>
              <div>
                <div className="font-mono text-sm font-semibold">
                  {student.current?.session}
                </div>
                <div className="text-xs text-muted-foreground">Session</div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function StudentsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-6 w-16 animate-pulse rounded bg-muted" />
          </CardContent>
          <CardFooter>
            <div className="grid w-full grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="space-y-1">
                  <div className="h-5 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
