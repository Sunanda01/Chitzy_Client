import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { uploadToCloudinary } from "../services/cloudinary";
import toast from "react-hot-toast";
const initialState = {
  fullName: "",
  email: "",
  profilePic: "",
  password: "",
};
function SignUpPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { signup, isSigningUp } = useAuthStore();
  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
    setFormData(initialState);
  };
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
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="h-[calc(100vh-64px)] mt-16 grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12  h-[calc(100vh-64px)]">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-2">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-5">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-control">
              <div className="flex flex-col items-center justify-center mt-3">
                <label
                  htmlFor="profileImageUpload"
                  className="relative flex items-center justify-center w-24 h-24 rounded-full border-5 border-white cursor-pointer overflow-hidden group transition-all"
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  ) : (
                    <img
                      src={formData.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="object-cover w-full h-full transition-all"
                    />
                  )}
                  {formData.profilePic && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-70 transition">
                      <span className="text-white text-xs font-semibold">
                        Change
                      </span>
                    </div>
                  )}
                  <input
                    id="profileImageUpload"
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    disabled={isUploading}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400 flex items-center justify-center mt-4">
                {isUploading ? "Uploading..." : "Upload Your Photo"}
              </p>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="size-5 text-base-content/40 " />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter your Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp || isUploading}
            >
              {isSigningUp || isUploading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
}

export default SignUpPage;
