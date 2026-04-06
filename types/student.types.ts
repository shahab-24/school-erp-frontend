// // src/types/student.types.ts
// // Mirrors backend: student.model.ts schema exactly

// export type LocalizedString = Record<string, string>; // { en, bn }

// export type StudentStatus =
//   | "active"
//   | "repeat"
//   | "passed"
//   | "transferred"
//   | "archived";

// export interface Parent {
//   name: LocalizedString;
//   mobile: string;
//   nid: string;
//   birthRegistration: string;
// }

// export interface Guardian {
//   relation: "guardian" | "other";
//   name: LocalizedString;
//   mobile: string;
//   nid?: string;
//   walletProvider: "bKash" | "Nagad" | "Rocket" | "Other";
// }

// export interface PromotionEntry {
//   session: string;
//   fromClass: number;
//   toClass: number;
//   result: "promoted" | "repeat";
//   previousRoll?: number;
//   newRoll?: number;
//   decidedAt: Date | string;
// }

// export interface StipendBeneficiary {
//   name: string;
//   mobile: string;
//   relation: "father" | "mother" | "guardian" | "other";
//   paymentMethod: "mobile_banking" | "bank" | "cash";
//   walletProvider: "bKash" | "Nagad" | "Rocket" | "Other";
//   isActive: boolean;
//   updatedAt: Date | string;
// }

// export interface Student {
//   _id: string;
//   studentUid: string;
//   name: LocalizedString;
//   gender: "male" | "female" | "other";
//   religion: string;
//   birthDate: string;
//   birthRegistration: string;
//   languagePreference: "bn" | "en";
//   father: Parent;
//   mother: Parent;
//   guardians: Guardian[];
//   stipendBeneficiary?: StipendBeneficiary;
//   imageUrl?: string;
//   current: {
//     session: string;
//     class: number;
//     roll: number;
//   };
//   status: StudentStatus;
//   promotions: PromotionEntry[];
//   archivedAt?: string;
//   createdAt: string;
//   updatedAt: string;
// }
// src/types/student.types.ts
// Mirrors backend student.model.ts + student.types.ts exactly

export type StudentStatus  = "active" | "repeat" | "passed" | "transferred" | "archived";
export type Gender         = "male" | "female" | "other";
export type LangPref       = "bn" | "en";
export type WalletProvider = "bKash" | "Nagad" | "Rocket" | "Other";
export type PaymentMethod  = "mobile_banking" | "bank" | "cash";
export type PromoteResult  = "promoted" | "repeat";
export type BloodGroup     = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "unknown";

export interface LocalizedString {
  en: string;
  bn?: string;
}

export interface Parent {
  name:              LocalizedString;
  mobile:            string;
  nid:               string;
  birthRegistration: string;
  occupation?:       string;
  education?:        string;
}

export interface Guardian {
  relation:       "guardian" | "other";
  name:           LocalizedString;
  mobile:         string;
  nid?:           string;
  walletProvider: WalletProvider;
}

export interface PromotionEntry {
  session:      string;
  fromClass:    number;
  toClass:      number;
  result:       PromoteResult;
  previousRoll?: number;
  newRoll?:     number;
  remarks?:     string;
  decidedAt:    Date | string;
}

export interface StipendBeneficiary {
  name:           string;
  mobile:         string;
  relation:       "father" | "mother" | "guardian" | "other";
  paymentMethod:  PaymentMethod;
  walletProvider?: WalletProvider;
  bankName?:      string;
  accountNumber?: string;
  isActive:       boolean;
  updatedAt:      Date | string;
}

export interface StudentAddress {
  village:  string;
  union:    string;
  upazila:  string;
  district: string;
  postCode?: string;
}

export interface Student {
  _id:                string;
  studentUid:         string;
  name:               LocalizedString;
  gender:             Gender;
  religion:           string;
  birthDate:          string;
  birthRegistration:  string;
  languagePreference: LangPref;
  imageUrl?:          string;
  cloudinaryPublicId?:string;
  bloodGroup?:        BloodGroup;
  nationality:        string;
  address?:           StudentAddress;
  father:             Parent;
  mother:             Parent;
  guardians:          Guardian[];
  stipendBeneficiary?:StipendBeneficiary;
  current: {
    session: string;
    class:   number;
    roll:    number;
  };
  status:      StudentStatus;
  promotions:  PromotionEntry[];
  archivedAt?: string;
  createdAt:   string;
  updatedAt:   string;
}

// ─── API response shapes ──────────────────────────────────────────

export interface PaginatedStudentsResponse {
  success: boolean;
  data:    Student[];
  meta: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
  };
}

export interface SingleStudentResponse {
  success: boolean;
  data:    Student;
}

export interface StudentStats {
  total:    number;
  byGender: { _id: string; count: number }[];
  byStatus: { _id: string; count: number }[];
  byClass:  { _id: number; count: number }[];
}

// ─── Roster (for bulk promote) ────────────────────────────────────

export interface RosterStudent {
  studentUid:   string;
  name:         LocalizedString;
  current: {
    roll:    number;
    class:   number;
    session: string;
  };
  gender: Gender;
  status: StudentStatus;
}