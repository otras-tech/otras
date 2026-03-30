import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import signupImage from "../LandingPage/assets/signup-image.png";
import { useMutation } from "@tanstack/react-query";
import { register } from "../services/authApi";
import { useAuthStore } from "../store/authStore";

export default function Signup() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const signupMutation = useMutation({
    mutationFn: (data: any) => register(data),
    onSuccess: (data) => {
      const { user, access_token, refresh_token } = data;
      setAuth(user, access_token, refresh_token || '');
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err.message || "Registration failed. Please try again.");
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    
    if (ref) {
      localStorage.setItem('referralCode', ref.toUpperCase());
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { email, password, confirmPassword } = formData;
    if (!email || !password || !confirmPassword) {
      setError("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    signupMutation.mutate(formData);
  };

  const loading = signupMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700 flex items-center justify-center px-6 py-10">
      
      <div className="w-full max-w-5xl overflow-hidden rounded-[30px] bg-white shadow-2xl grid md:grid-cols-2">

        <div className="hidden md:flex items-center justify-center bg-blue-50 p-8">
          <img
            src={signupImage}
            alt="Signup visual"
            className="w-full max-w-sm object-contain"
          />
        </div>

        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">

            <h1 className="text-4xl font-extrabold text-center text-blue-800">
              SIGN UP
            </h1>

            <p className="mt-4 text-center text-slate-500">
              Create your OTRAS account to get started
            </p>

            {error && (
              <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-600 text-sm font-medium">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-700 py-4 text-lg font-bold text-white transition-all hover:bg-blue-600 shadow-lg shadow-blue-700/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? 'Processing...' : 'Create Account'}
              </button>

            </form>

            <p className="mt-8 text-center text-gray-700 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-orange-500 hover:text-orange-600 underline underline-offset-4"
              >
                Login here
              </Link>
            </p>

            <p className="mt-6 text-center text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Back to Home
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}