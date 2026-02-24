export const appConfig = {
  schoolNameEn: process.env.NEXT_PUBLIC_SCHOOL_NAME_EN || "School ERP",
  schoolNameBn: process.env.NEXT_PUBLIC_SCHOOL_NAME_BN || "",
  established: process.env.NEXT_PUBLIC_SCHOOL_ESTABLISHED || "",
  phone: process.env.NEXT_PUBLIC_SCHOOL_PHONE || "",
  address: process.env.NEXT_PUBLIC_SCHOOL_ADDRESS || "",
  logo: process.env.NEXT_PUBLIC_SCHOOL_LOGO || "/logo.png",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
};
