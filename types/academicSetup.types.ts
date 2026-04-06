// src/types/academicSetup.types.ts
// Mirrors: src/modules/academic-setup/ models

// ─── ExamType ─────────────────────────────────────────────────────

export interface ExamType {
  _id: string;
  schoolId?: string;
  name: string; // e.g. "Half Yearly"
  code: string; // e.g. "HY"  (unique per school)
  order: number; // for sorting in dropdowns
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── MarkStructure ────────────────────────────────────────────────

export interface MarkStructureComponent {
  key: string; // e.g. "written"
  label: string; // e.g. "Written Exam"
  totalMarks: number;
  required: boolean;
}

export interface MarkStructure {
  _id: string;
  schoolId: string;
  name: string; // e.g. "Standard 100"
  components: MarkStructureComponent[];
  createdAt: string;
  updatedAt: string;
}
