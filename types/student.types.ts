export type LocalizedString = {
  en: string;
  bn: string;
};

export interface Parent {
  name: LocalizedString;
  mobile: string;
  nid: string;
  birthRegistration: string;
}

export type WalletProvider = "bKash" | "Nagad" | "Rocket" | "Other";

export interface Guardian {
  relation: "guardian" | "other";
  name: LocalizedString;
  mobile: string;
  nid?: string;
  walletProvider: WalletProvider;
}

export interface Student {
  studentUid: string;
  name: LocalizedString;
  gender: "male" | "female" | "other";
  religion: string;
  birthDate: string;
  birthRegistration: string;
  languagePreference: "bn" | "en";
  father: Parent;
  mother: Parent;
  guardians?: Guardian[];
  current: {
    session: string;
    class: number;
    roll: number;
  };
}
