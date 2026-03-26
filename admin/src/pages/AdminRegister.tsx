import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, AlertCircle, User as UserIcon, Lock } from "lucide-react";

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resp = await axios.post(
        "http://localhost:4000/admin/auth/register",
        formData
      );

      localStorage.setItem("adminToken", resp.data.access_token);
      localStorage.setItem("adminUser", JSON.stringify(resp.data.admin));

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-light)]">

      <div className="w-full max-w-md app-card p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white mx-auto mb-4">
            <UserPlus size={22} />
          </div>

          <h1 className="text-2xl font-bold">
            Admin Registration
          </h1>

          <p className="text-sm text-[var(--text-secondary)]">
            Create an OTRAS administrator account
          </p>

        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-xl border"
            style={{
              background: "#fef2f2",
              borderColor: "var(--danger)",
              color: "var(--danger)"
            }}
          >
            <AlertCircle size={18} />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div className="space-y-1">

            <label className="text-sm font-semibold">
              Username
            </label>

            <div className="relative">

              <UserIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                required
                className="input w-full !pl-10"
                placeholder="e.g. main_admin"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />

            </div>

          </div>

          {/* Email */}
          <div className="space-y-1">

            <label className="text-sm font-semibold">
              Email Address
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                required
                type="email"
                className="input w-full !pl-10"
                placeholder="admin@otras.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

            </div>

          </div>

          {/* Password */}
          <div className="space-y-1">

            <label className="text-sm font-semibold">
              Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                required
                type="password"
                className="input w-full !pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

            </div>

          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="btn-primary w-full flex justify-center items-center"
          >
            {loading ? "Processing..." : "Create Admin Account"}
          </button>

        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[var(--color-primary)] hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>

    </div>
  );
}