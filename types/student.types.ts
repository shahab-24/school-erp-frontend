export interface LocalizedString {
  en: string;
  bn: string;
}

export interface Guardian {
  relation: "father" | "mother" | "guardian";
  name: LocalizedString;
  mobile?: string;
  nid?: string;
  birthRegistration?: string;
  walletProvider?: "bKash" | "Nagad" | "Rocket" | "Other";
}

export interface StipendBeneficiary {
  name: string;
  mobile: string;
  relation: "father" | "mother" | "guardian" | "other";
  paymentMethod: "mobile_banking" | "bank" | "cash";
  walletProvider?: "bKash" | "Nagad" | "Rocket" | "Other";
  isActive?: boolean;
  updatedAt?: Date;
}

export interface Student {
  studentUid: string;
  name: LocalizedString;
  gender?: "male" | "female" | "other";
  religion?: string;
  birthDate?: string;
  birthRegistration?: string;
  guardians?: Guardian[];
  stipendBeneficiary?: StipendBeneficiary;
  current: {
    session: string;
    class: number;
    roll?: number;
  };
  status: "active" | "repeat" | "passed" | "transferred" | "archived";
}

export interface PromotePayload {
  session: string;
  fromClass: number;
  toClass: number;
  result: "promoted" | "repeat";
  previousRoll?: number;
  newRoll?: number;
}

export interface UpdateStatusPayload {
  status: "active" | "repeat" | "passed" | "transferred" | "archived";
}
