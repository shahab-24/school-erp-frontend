"use client";

import { useState } from "react";
import { useCreateStudentMutation } from "@/lib/services/studentApi";
import { useRouter } from "next/navigation";

export default function CreateStudentPage() {
  const router = useRouter();
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const [error, setError] = useState<string | null>(null);

  const [guardians, setGuardians] = useState<any[]>([]);

  const addGuardian = () => {
    setGuardians([
      ...guardians,
      {
        relation: "guardian",
        name: { en: "", bn: "" },
        mobile: "",
        walletProvider: "bKash",
      },
    ]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);

    const payload = {
      studentUid: formData.get("studentUid"),
      name: {
        en: formData.get("name_en"),
        bn: formData.get("name_bn"),
      },
      gender: formData.get("gender"),
      religion: formData.get("religion"),
      birthDate: formData.get("birthDate"),
      birthRegistration: formData.get("birthRegistration"),
      languagePreference: "bn",

      father: {
        name: {
          en: formData.get("father_en"),
          bn: formData.get("father_bn"),
        },
        mobile: formData.get("father_mobile"),
        nid: formData.get("father_nid"),
        birthRegistration: formData.get("father_br"),
      },

      mother: {
        name: {
          en: formData.get("mother_en"),
          bn: formData.get("mother_bn"),
        },
        mobile: formData.get("mother_mobile"),
        nid: formData.get("mother_nid"),
        birthRegistration: formData.get("mother_br"),
      },

      guardians,

      current: {
        session: formData.get("session"),
        class: Number(formData.get("class")),
        roll: Number(formData.get("roll")),
      },
    };

    try {
      await createStudent(payload).unwrap();
      router.push("/students");
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create student");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Create Student</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <input
          name="studentUid"
          placeholder="Student UID"
          className="input"
          required
        />
        <input
          name="birthRegistration"
          placeholder="Birth Registration"
          className="input"
          required
        />

        <input
          name="name_en"
          placeholder="Name (EN)"
          className="input"
          required
        />
        <input
          name="name_bn"
          placeholder="Name (BN)"
          className="input"
          required
        />

        <input name="birthDate" type="date" className="input" required />

        <select name="gender" className="input" required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          name="religion"
          placeholder="Religion"
          className="input"
          required
        />

        <hr className="col-span-2 my-4" />

        <h2 className="col-span-2 font-semibold">Father Info</h2>

        <input
          name="father_en"
          placeholder="Father Name EN"
          className="input"
          required
        />
        <input
          name="father_bn"
          placeholder="Father Name BN"
          className="input"
          required
        />
        <input
          name="father_mobile"
          placeholder="Father Mobile"
          className="input"
          required
        />
        <input
          name="father_nid"
          placeholder="Father NID"
          className="input"
          required
        />
        <input
          name="father_br"
          placeholder="Father Birth Reg"
          className="input"
          required
        />

        <h2 className="col-span-2 font-semibold">Mother Info</h2>

        <input
          name="mother_en"
          placeholder="Mother Name EN"
          className="input"
          required
        />
        <input
          name="mother_bn"
          placeholder="Mother Name BN"
          className="input"
          required
        />
        <input
          name="mother_mobile"
          placeholder="Mother Mobile"
          className="input"
          required
        />
        <input
          name="mother_nid"
          placeholder="Mother NID"
          className="input"
          required
        />
        <input
          name="mother_br"
          placeholder="Mother Birth Reg"
          className="input"
          required
        />

        <hr className="col-span-2 my-4" />

        <h2 className="col-span-2 font-semibold">Guardians (Optional)</h2>

        {guardians.map((g, index) => (
          <div
            key={index}
            className="col-span-2 grid md:grid-cols-4 gap-3 border p-3 rounded"
          >
            <input
              placeholder="Guardian EN"
              className="input"
              onChange={(e) => {
                const updated = [...guardians];
                updated[index].name.en = e.target.value;
                setGuardians(updated);
              }}
            />
            <input
              placeholder="Guardian BN"
              className="input"
              onChange={(e) => {
                const updated = [...guardians];
                updated[index].name.bn = e.target.value;
                setGuardians(updated);
              }}
            />
            <input
              placeholder="Mobile"
              className="input"
              onChange={(e) => {
                const updated = [...guardians];
                updated[index].mobile = e.target.value;
                setGuardians(updated);
              }}
            />

            <select
              className="input"
              onChange={(e) => {
                const updated = [...guardians];
                updated[index].walletProvider = e.target.value;
                setGuardians(updated);
              }}
            >
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="Rocket">Rocket</option>
              <option value="Other">Other</option>
            </select>
          </div>
        ))}

        <button
          type="button"
          onClick={addGuardian}
          className="col-span-2 bg-gray-200 p-2 rounded"
        >
          + Add Guardian
        </button>

        <hr className="col-span-2 my-4" />

        <h2 className="col-span-2 font-semibold">Class Info</h2>

        <input
          name="session"
          placeholder="Session"
          className="input"
          required
        />
        <input
          name="class"
          placeholder="Class"
          type="number"
          className="input"
          required
        />
        <input
          name="roll"
          placeholder="Roll"
          type="number"
          className="input"
          required
        />

        <button
          disabled={isLoading}
          className="col-span-2 bg-blue-600 text-white p-3 rounded-lg mt-4"
        >
          {isLoading ? "Creating..." : "Create Student"}
        </button>
      </form>
    </div>
  );
}
