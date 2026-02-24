"use client";

import { Student } from "@/types/student.types";



interface Props {
  onSubmit: (data: Student) => void;
  loading: boolean;
}

export default function StudentForm({ onSubmit, loading }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const payload: Student = {
      studentUid: form.get("studentUid") as string,
      name: {
        en: form.get("name_en") as string,
        bn: form.get("name_bn") as string,
      },
      gender: form.get("gender") as Student["gender"],
      religion: form.get("religion") as string,
      birthDate: form.get("birthDate") as string,
      birthRegistration: form.get("birthRegistration") as string,
      languagePreference: "bn",
      father: {
        name: {
          en: form.get("father_en") as string,
          bn: form.get("father_bn") as string,
        },
        mobile: form.get("father_mobile") as string,
        nid: form.get("father_nid") as string,
        birthRegistration: form.get("father_br") as string,
      },
      mother: {
        name: {
          en: form.get("mother_en") as string,
          bn: form.get("mother_bn") as string,
        },
        mobile: form.get("mother_mobile") as string,
        nid: form.get("mother_nid") as string,
        birthRegistration: form.get("mother_br") as string,
      },
      guardians: [],
      current: {
        session: form.get("session") as string,
        class: Number(form.get("class")),
        roll: Number(form.get("roll")),
      },
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input name="studentUid" placeholder="Student UID" required />
      <input name="name_en" placeholder="Name EN" required />
      <input name="name_bn" placeholder="Name BN" required />
      <button disabled={loading}>
        {loading ? "Saving..." : "Save Student"}
      </button>
    </form>
  );
}
