import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import signupImage from "../LandingPage/assets/signup-image.png";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: localStorage.getItem('referralCode') || "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Sync referral code from URL or localStorage into state
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const stored = localStorage.getItem('referralCode');
    
    if (ref && formData.referralCode !== ref.toUpperCase()) {
      setFormData(prev => ({ ...prev, referralCode: ref.toUpperCase() }));
      localStorage.setItem('referralCode', ref.toUpperCase());
    } else if (stored && !formData.referralCode) {
      setFormData(prev => ({ ...prev, referralCode: stored }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { fullName, username, email, phone, password, confirmPassword } =
      formData;

    if (!fullName || !username || !email || !phone || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Account created successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700 flex items-center justify-center px-6 py-10">
      
      {/* MAIN CARD (SIZE REDUCED) */}
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl grid md:grid-cols-2">

        {/* LEFT IMAGE SECTION */}
        <div className="hidden md:flex items-center justify-center bg-slate-100 p-6">
          <img
            src={signupImage}
            alt="Signup visual"
            className="w-full max-w-sm object-contain"
          />
        </div>

        {/* FORM SECTION */}
        <div className="flex items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-sm">

            <h1 className="text-3xl font-extrabold text-center text-blue-700">
              CREATE ACCOUNT
            </h1>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">

              {/* FULL NAME */}
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 outline-none focus:border-blue-600"
              />

              {/* USERNAME */}
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 outline-none focus:border-blue-600"
              />

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 outline-none focus:border-blue-600"
              />

              {/* PHONE */}
              <input
                type="tel"
                name="phone"
                placeholder="Phone (10 digits)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 outline-none focus:border-blue-600"
              />

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-gray-800 outline-none focus:border-blue-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-gray-800 outline-none focus:border-blue-600"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* REFERRAL CODE */}
              <div className="relative">
                <input
                  type="text"
                  name="referralCode"
                  placeholder="Referral Code (Optional)"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 outline-none focus:border-blue-600"
                />
                {formData.referralCode && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    Applied 🎉
                  </span>
                )}
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-700 py-3 text-base font-semibold text-white transition hover:bg-blue-800"
              >
                Get Started
              </button>

            </form>

            {/* LOGIN LINK */}
            <p className="mt-6 text-center text-gray-700 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-orange-500 hover:text-orange-600"
              >
                Login here
              </Link>
            </p>

            {/* BACK HOME */}
            <p className="mt-4 text-center text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Home
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}