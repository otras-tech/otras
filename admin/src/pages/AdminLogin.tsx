import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      const resp = await axios.post(
        "http://localhost:4000/admin/auth/login",
        { email, password }
      );

      localStorage.setItem("adminToken", resp.data.access_token);
      localStorage.setItem("adminUser", JSON.stringify(resp.data.admin));

      navigate("/");

    } catch (err: any) {

      setError(err.response?.data?.message || "Login failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-light)]">

      <div className="w-full max-w-md app-card p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock size={22} />
          </div>

          <h1 className="text-2xl font-bold">
            Admin Login
          </h1>

          <p className="text-sm text-[var(--text-secondary)]">
            Access the OTRAS management console
          </p>

        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-3 p-4 mb-6 rounded-xl border"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>

          </div>

          {/* Submit */}
          <button
            disabled={loading}
            type="submit"
            className="btn-primary w-full flex justify-center items-center"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>

        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          New admin?{" "}
          <Link
            to="/register"
            className="font-semibold text-[var(--color-primary)] hover:underline"
          >
            Register account
          </Link>
        </p>

      </div>

    </div>
  );
}