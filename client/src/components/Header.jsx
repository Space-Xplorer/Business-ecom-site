import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-700">
          Textile Store
        </Link>
        <nav className="flex gap-6">
          <Link to="/products" className="text-gray-700 hover:text-indigo-600">
            Products
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-indigo-600">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
