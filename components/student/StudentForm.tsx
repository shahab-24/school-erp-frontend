"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "@/components/ui/use-toast"
import { StudentFormData, studentSchema } from "@/schemas/student.schema"
import { useCreateStudentMutation } from "@/lib/services/studentApi"

export default function StudentForm() {
  const [createStudent, { isLoading }] = useCreateStudentMutation()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      guardians: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guardians",
  })

  const onSubmit = async (data: StudentFormData) => {
    try {
      await createStudent(data).unwrap()
      toast({ title: "Student Created Successfully" })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.data?.message || "Failed",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <input {...register("studentUid")} placeholder="Student UID" />
      {errors.studentUid && <p>{errors.studentUid.message}</p>}

      <input {...register("name.en")} placeholder="Name EN" />
      <input {...register("name.bn")} placeholder="Name BN" />

      {/* Father */}
      <h2>Father</h2>
      <input {...register("father.name.en")} placeholder="Father EN" />
      <input {...register("father.mobile")} placeholder="Father Mobile" />

      {/* Guardians */}
      <h2>Guardians</h2>
      {fields.map((field, index) => (
        <div key={field.id} className="border p-4 rounded">
          <input {...register(`guardians.${index}.name.en`)} placeholder="Guardian EN" />
          <select {...register(`guardians.${index}.walletProvider`)}>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
            <option value="Other">Other</option>
          </select>
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      )}

      <button
        type="button"
        onClick={() =>
          append({
            relation: "guardian",
            name: { en: "", bn: "" },
            mobile: "",
            walletProvider: "bKash",
          })
        }
      >
        Add Guardian
      </button>

      <button disabled={isLoading}>
        {isLoading ? "Saving..." : "Create Student"}
      </button>
    </form>
  )
}
