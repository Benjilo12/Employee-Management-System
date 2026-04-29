import LoginLeftSide from "./LoginLeftSide";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

const LoginForm = ({ role, title, subtitle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add your login logic here
  };

  // Shared class for inputs to keep it clean
  const inputStyles =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <LoginLeftSide />

      {/* Right Side - Form Container */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium mb-12 transition-colors group"
          >
            <ArrowLeftIcon
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Portals
          </Link>

          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
              {title || "Welcome Back"}
            </h1>
            <p className="text-slate-500 mt-3 text-lg">
              {subtitle || "Please enter your details to sign in."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              {/* Removed the flex container and Forgot Password link */}
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={inputStyles}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOffIcon
                      size={20}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    />
                  ) : (
                    <EyeIcon
                      size={20}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-base font-bold shadow-md shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <Loader2Icon className="animate-spin h-5 w-5" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Footer */}
          <p className="mt-10 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Contact Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
