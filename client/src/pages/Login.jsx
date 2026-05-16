import { Link, Navigate } from "react-router-dom";
import LoginLeftSide from "../components/LoginLeftSide";
import { ArrowRightIcon, ShieldIcon, UserIcon } from "lucide-react";
import { useAuth } from "../context/authContext";
import Loading from "../components/Loading";

const Login = () => {
  // Get authenticated user state and loading status from auth context
  const { user, loading } = useAuth();

  // Show spinner while auth status is being checked
  if (loading) return <Loading />;

  // Redirect already authenticated users away from the login page
  if (user) return <Navigate to="/dashboard" replace />;

  // Different login portals available for admin and employee
  const portalOptions = [
    {
      to: "/login/admin",
      title: "Admin Portal",
      subtitle: "Access your admin dashboard to manage the organization.",
      icon: ShieldIcon,
      color: "indigo",
    },
    {
      to: "/login/employee",
      title: "Employee Portal",
      subtitle: "Access your employee dashboard to manage your profile.",
      icon: UserIcon,
      color: "emerald",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />

      {/* RIGHT SIDE: Portal selection panel */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-14 lg:p-20 bg-gray-50 relative overflow-hidden min-h-screen">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-lg relative z-10">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              Secure Login
            </div>
            <h2 className="text-4xl font-semibold text-gray-900 tracking-tight mb-4">
              Welcome Back 👋
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Select your portal below to access your dashboard and manage your
              account.
            </p>
          </div>

          {/* Portal options */}
          <div className="space-y-5">
            {portalOptions.map((portal) => (
              <Link
                key={portal.to}
                to={portal.to}
                className="group flex items-center gap-5 bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-0.5"
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300
                  ${
                    portal.color === "indigo"
                      ? "bg-indigo-50 group-hover:bg-indigo-100"
                      : "bg-emerald-50 group-hover:bg-emerald-100"
                  }`}
                >
                  <portal.icon
                    className={`w-7 h-7 ${
                      portal.color === "indigo"
                        ? "text-indigo-600"
                        : "text-emerald-600"
                    }`}
                  />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors mb-1">
                    {portal.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {portal.subtitle}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRightIcon className="w-6 h-6 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-10">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">Need help?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Footer */}
          <p className="mt-12 text-center text-sm text-gray-300">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
