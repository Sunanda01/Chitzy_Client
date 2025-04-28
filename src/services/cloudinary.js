export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file),
    formData.append("upload_preset", "ClientProfileImage");
  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dgciy5wwi/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    console.log("Response", data);
    return data.secure_url;
  } catch (err) {
    console.error("Upload failed:", err.message);
  }
};
