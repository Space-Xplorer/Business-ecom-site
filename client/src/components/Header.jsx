import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const res = await axios.get("http://localhost:8080/user/status");
      if (res.data.isAuthenticated) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/user/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b-2 border-[#FFD700]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/Logo.jpg" alt="Erimuga Logo" className="h-10.5 w-auto object-contain rounded" />
          {/* <span className="text-2xl font-bold tracking-wide" style={{ color: '#FFD700' }}>ERIMUGA</span> */}
        </Link>

        <nav className="flex gap-6 text-lg font-medium">
          <Link to="/" className="text-black hover:text-[#F26A1B] transition">Home</Link>
          <Link to="/products" className="text-black hover:text-[#F26A1B] transition">Products</Link>
          <Link to="/apparels" className="text-black hover:text-[#F26A1B] transition">Apparels</Link>
          <Link to="/about" className="text-black hover:text-[#F26A1B] transition">About Us</Link>
          <Link to="/cart" className="text-black hover:text-[#F26A1B] transition">Cart</Link>

          {!user ? (
            <>
              <Link to="/login" className="text-black hover:text-[#F26A1B] transition">Login</Link>
              <Link to="/signup" className="text-black hover:text-[#F26A1B] transition">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="text-black hover:text-[#F26A1B] transition">Profile</Link>
              <button
                onClick={handleLogout}
                className="text-black hover:text-red-500 transition bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
