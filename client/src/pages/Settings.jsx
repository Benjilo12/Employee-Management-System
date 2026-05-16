import { useEffect, useState } from "react";

import Loading from "../components/Loading";
import { Lock } from "lucide-react";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { useAuth } from "../context/authContext";
import api from "../api/axios";
import toast from "react-hot-toast";

// Settings page: manage account and preferences
const Settings = () => {
  const { user } = useAuth();
  // component state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Fetch user's profile from the API
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      const profile = res.data;
      if (profile) setProfile(profile);
    } catch (error) {
      toast.error(error.response.data.error || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Load profile when component mounts
  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loading />;
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>
      {profile && (
        // Profile form: edit personal details
        <ProfileForm initialData={profile} onSuccess={fetchProfile} />
      )}

      {/* change password trigger */}
      <div className="card max-w-md p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Lock className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              Password
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update your account password
            </p>
          </div>
        </div>
        <button
          className="btn-secondary text-sm cursor-pointer"
          onClick={() => setShowPasswordModal(true)}
        >
          Change
        </button>
      </div>
      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Settings;
