import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Loader2, AlertCircle, User as UserIcon, Lock } from "lucide-react";
import loginImage from "../LandingPage/assets/login-image.png";

export default function Login({ onAuthSuccess }) {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginId || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        email: loginId,
        password
      });

      const { user, access_token } = response.data;

      // Store auth data
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Inform parent component
      if (onAuthSuccess) {
        onAuthSuccess(user);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTR ID/Email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-2xl grid md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-blue-50 p-8">
          <img
            src={loginImage}
            alt="Login visual"
            className="w-full max-w-md object-contain"
          />
        </div>

        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-extrabold text-center text-blue-800">
              LOGIN
            </h1>

            <p className="mt-4 text-center text-slate-500">
              Enter your OTR Registration ID or Email Address
            </p>

            {error && (
              <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-600 text-sm font-medium">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  OTR ID / Email
                </label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="MH26260123 or email@domain.com"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-700 py-4 text-lg font-bold text-white transition-all hover:bg-blue-600 shadow-lg shadow-blue-700/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-700">
              Don&apos;t have an account?{" "}
              <Link
                to="/profile"
                className="font-bold text-orange-500 hover:text-orange-600"
              >
                Register here
              </Link>
            </p>

            <p className="mt-6 text-center">
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