"use client";

import { useGetStudentsQuery } from "@/lib/services/studentApi";
import Link from "next/link";

export default function StudentListPage() {
  const { data, isLoading } = useGetStudentsQuery({});

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Link
          href="/students/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Student
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">UID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Class</th>
              <th className="p-3">Roll</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((student: any) => (
              <tr key={student.studentUid} className="border-t">
                <td className="p-3">{student.studentUid}</td>
                <td className="p-3">
                  {student.name?.en} / {student.name?.bn}
                </td>
                <td className="p-3">{student.current?.class}</td>
                <td className="p-3">{student.current?.roll}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
