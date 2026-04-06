export async function uploadToCloudinary(file: File) {
  const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUD || !PRESET) {
    throw new Error("Cloudinary env missing");
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);
  fd.append("folder", "erp/students");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    {
      method: "POST",
      body: fd,
    }
  );

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}
