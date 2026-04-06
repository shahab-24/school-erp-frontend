// components/students/StudentsTable.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Student } from "@/types/student.types";

const STATUS_COLORS = {
  active: "bg-green-500",
  repeat: "bg-yellow-500",
  passed: "bg-blue-500",
  transferred: "bg-purple-500",
  archived: "bg-gray-500",
} as const;

interface StudentsTableProps {
  students: Student[];
  isLoading?: boolean;
}

export function StudentsTable({ students, isLoading }: StudentsTableProps) {
  const router = useRouter();

  if (isLoading) {
    return <StudentsTableSkeleton />;
  }

  if (students.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Roll</TableHead>
            <TableHead className="hidden md:table-cell">Session</TableHead>
            <TableHead className="hidden lg:table-cell">
              Father Mobile
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student.studentUid}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() =>
                router.push(`/dashboard/students/${student.studentUid}`)
              }
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {student.name?.en?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{student.name?.en}</div>
                    <div className="text-xs text-muted-foreground">
                      UID: {student.studentUid}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {student.current?.class}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {student.current?.roll}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {student.current?.session}
              </TableCell>
              <TableCell className="hidden lg:table-cell font-mono text-sm">
                {student.father?.mobile || "—"}
              </TableCell>
              <TableCell>
                <Badge
                  className={`${
                    STATUS_COLORS[
                      student.status as keyof typeof STATUS_COLORS
                    ] || "bg-gray-500"
                  } text-white`}
                >
                  {student.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/students/${student.studentUid}`);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StudentsTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Roll</TableHead>
            <TableHead className="hidden md:table-cell">Session</TableHead>
            <TableHead className="hidden lg:table-cell">
              Father Mobile
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 7 }).map((_, j) => (
                <TableCell key={j}>
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold">No students found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Try adjusting your filters or add a new student.
      </p>
      <Button className="mt-4" asChild>
        <Link href="/students/create">Add Student</Link>
      </Button>
    </div>
  );
}
