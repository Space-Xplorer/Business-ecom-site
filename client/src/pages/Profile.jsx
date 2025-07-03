import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/user/dashboard", { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(err => {
        setError("You must be logged in to view this page.");
        setLoading(false);
        setTimeout(() => navigate("/login"), 1500);
      });
  }, [navigate]);

  if (loading) return <div className="text-center py-8">Loading profile...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-20 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-[#F26A1B] text-center">User Profile</h2>
      <div className="space-y-4">
        <div><span className="font-semibold">Username:</span> {user.username}</div>
        <div><span className="font-semibold">Email:</span> {user.email}</div>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
} 