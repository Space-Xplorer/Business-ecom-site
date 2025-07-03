import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-md border-b-2 border-[#FFD700]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/Logo.jpg" alt="Erimund Logo" className="h-10 w-10 object-contain rounded" />
          <span className="text-2xl font-bold text-black tracking-wide" style={{ color: '#FFD700' }}>Erimund</span>
        </Link>
        <nav className="flex gap-6 text-lg font-medium">
          <Link to="/" className="text-black hover:text-[#F26A1B] transition">Home</Link>
          <Link to="/products" className="text-black hover:text-[#F26A1B] transition">Products</Link>
          <Link to="/apparels" className="text-black hover:text-[#F26A1B] transition">Apparels</Link>
          <Link to="/about" className="text-black hover:text-[#F26A1B] transition">About Us</Link>
          <Link to="/cart" className="text-black hover:text-[#F26A1B] transition">Cart</Link>
          <Link to="/login" className="text-black hover:text-[#F26A1B] transition">Login</Link>
        </nav>
      </div>
    </header>
  );
}
