import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Carousel from "../components/Carousel";

axios.defaults.withCredentials = true;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/user/login", {
        email,
        password,
      });

      if (res.status === 200) {
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#FFF8E1] via-[#FFD700]/20 to-[#F26A1B]/10">
      {/* Left: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white shadow-xl z-10">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-extrabold text-center text-[#F26A1B] mb-6">Login to Erimuga</h2>
          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email address</label>
              <input
                type="email"
                className="w-full px-4 py-2 border-2 border-[#FFD700]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border-2 border-[#FFD700]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-black text-[#FFD700] py-2 rounded-lg font-bold hover:bg-[#F26A1B] hover:text-white transition">Login</button>
            <a href="http://localhost:8080/user/auth/google" className="w-full flex items-center justify-center gap-2 mt-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-bold hover:bg-[#F26A1B] hover:text-white transition shadow">
              <img src="./google-icon.svg" alt="Google" className="h-5 w-5" />
              log in with Google
            </a>
          </form>
          <div className="text-center mt-3">
            <span className="text-gray-700">Don't have an account? </span>
            <Link to="/signup" className="text-[#F26A1B] font-semibold hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
      {/* Right: Carousel */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-black/80 relative">
        <div className="absolute inset-0 z-0">
          <Carousel />
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent z-10" />
      </div>
    </div>
  );
}
