import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { adminLogin } from "../services/adminAuthApi";
import { useAuthStore } from "../store/authStore";

export default function AdminLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: (data: any) => adminLogin(data),
    onSuccess: (data) => {
      setAuth(data.admin, data.access_token, data.refresh_token);
      navigate("/");
    },
    onError: (err: any) => {
      setError(err.message || "Login failed");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  const loading = loginMutation.isPending;

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