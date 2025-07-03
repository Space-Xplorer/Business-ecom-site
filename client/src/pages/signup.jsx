import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/user/signup", formData, {
        withCredentials: true,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8E1] via-[#FFD700]/20 to-[#F26A1B]/10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-[#F26A1B] mb-6">Sign Up for Erimuga</h2>
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Username</label>
            <input name="username" type="text" className="w-full px-4 py-2 border-2 border-[#FFD700]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input name="email" type="email" className="w-full px-4 py-2 border-2 border-[#FFD700]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input name="password" type="password" className="w-full px-4 py-2 border-2 border-[#FFD700]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" onChange={handleChange} required />
          </div>
          <button type="submit" className="w-full bg-black text-[#FFD700] py-2 rounded-lg font-bold hover:bg-[#F26A1B] hover:text-white transition">Sign Up</button>
          <a href="http://localhost:8080/user/auth/google" className="w-full flex items-center justify-center gap-2 mt-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-bold hover:bg-[#F26A1B] hover:text-white transition shadow">
            <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
            Sign up with Google
          </a>
        </form>
        <div className="text-center mt-3">
          <span className="text-gray-700">Already have an account? </span>
          <Link to="/login" className="text-[#F26A1B] font-semibold hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}
