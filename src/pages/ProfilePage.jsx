import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from "../services/cloudinary";
import toast from "react-hot-toast";

function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfileDetails } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser.fullName,
    profilePic: authUser.profilePic,
  });
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      });
    }
  }, [authUser]);
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        profilePic: url,
      }));
    } catch (err) {
      toast.error("Failed to Upload image");
      console.log;
    } finally {
      setIsUploading(false);
    }
  };
  const updateProfile = async (e) => {
    e.preventDefault();
    await updateProfileDetails(formData);
  };
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8 flex flex-col">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={formData.profilePic}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUpdatingProfile || isUploading}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <input
                type="text"
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-0 bg-base-300 rounded-xl p-6 ">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
          <button
            className="btn btn-outline btn-secondary flex justify-center items-center"
            disabled={isUpdatingProfile || isUploading}
            onClick={updateProfile}
            type="submit"
          >
            {isUpdatingProfile || isUploading ? "Updating...." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
