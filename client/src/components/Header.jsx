import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import { useCart } from "./CartContext";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
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
          <img src="/Logo.jpg" alt="Erimuga Logo" className="h-10.5 w-auto object-contain" />
          {/* <span className="text-2xl font-bold tracking-wide" style={{ color: '#FFD700' }}>ERIMUGA</span> */}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-lg font-medium flex-1 justify-center">
          <Link to="/" className="text-black hover:text-[#F26A1B] transition">Home</Link>
          <Link to="/products" className="text-black hover:text-[#F26A1B] transition">Products</Link>
          <Link to="/apparels" className="text-black hover:text-[#F26A1B] transition">Apparels</Link>
          <Link to="/about" className="text-black hover:text-[#F26A1B] transition">About Us</Link>
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
        {/* Cart Icon (always visible, rightmost) */}
        <Link to="/cart" className="ml-4 text-black hover:text-[#F26A1B] transition relative flex items-center">
          <FaShoppingCart size={26} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#F26A1B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Link>
        {/* Hamburger for mobile */}
        <button className="md:hidden ml-4" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={26} />
        </button>
        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b-2 border-[#FFD700] flex flex-col items-center py-4 md:hidden z-50">
            <Link to="/" className="py-2 text-black hover:text-[#F26A1B] w-full text-center" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" className="py-2 text-black hover:text-[#F26A1B] w-full text-center" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link to="/apparels" className="py-2 text-black hover:text-[#F26A1B] w-full text-center" onClick={() => setMenuOpen(false)}>Apparels</Link>
            <Link to="/about" className="py-2 text-black hover:text-[#F26A1B] w-full text-center" onClick={() => setMenuOpen(false)}>About Us</Link>
            {!user ? (
              <>
                <Link to="/login" className="py-2 text-black hover:text-[#F26A1B] w-full text-center" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="py-2 text-black hover:text-[#F26A1B] w-full text-center" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="py-2 text-black hover:text-[#F26A1B] w-full text-center" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="py-2 text-black hover:text-red-500 w-full text-center bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
