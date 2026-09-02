import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/profile", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setProfile(result.response);
        } else {
          setError(result.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Network error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-4 sm:p-8 text-slate-900 w-full max-w-5xl lg:max-w-6xl mx-auto space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900">User Profile</h1>

      {loading ? (
        <div className="text-slate-500 py-10">Loading profile...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      ) : profile ? (
        <div className="bg-white border border-blue-100 p-6 sm:p-8 rounded-2xl shadow-2xs space-y-6">
          <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-xs">
              {profile.username ? profile.username.slice(0, 2).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{profile.username}</h2>
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-semibold inline-block mt-1">
                CollabSpace Member
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Username</p>
              <p className="text-base font-semibold text-slate-900 mt-1">{profile.username}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">User ID</p>
              <p className="text-sm font-mono text-slate-700 mt-1">{profile._id}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/organizations")}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-2xs cursor-pointer"
            >
              Organizations
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserProfile;
