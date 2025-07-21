import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import axios from "axios";

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const listRef = useRef(null);
  const perPage = 20;
  const safeProducts = Array.isArray(products) ? products : [];
  // Get unique categories from products
  const categories = Array.from(new Set(safeProducts.map(p => p.mainCategory || ""))).filter(Boolean);

  // Filtering logic
  const filtered = safeProducts.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesMin = minPrice === "" || item.price >= Number(minPrice);
    const matchesMax = maxPrice === "" || item.price <= Number(maxPrice);
    const matchesCat = !category || item.mainCategory === category;
    return matchesSearch && matchesMin && matchesMax && matchesCat;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:8080/api/products")
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Scroll to top of product list on page change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [page, filtered]);

  const handleAddToCart = (item, qty) => {
    addToCart({ ...item, id: item._id, productId: item._id }, qty);
    setMessage(`${item.name} added to cart!`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  };

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, minPrice, maxPrice, category]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Our Products</h2>
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center items-end">
            <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 border rounded w-48 focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" />
            <input type="number" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="px-3 py-2 border rounded w-32 focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" min="0" />
            <input type="number" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="px-3 py-2 border rounded w-32 focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" min="0" />
            {categories.length > 0 && (
              <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 border rounded w-40 focus:outline-none focus:ring-2 focus:ring-[#F26A1B]">
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            )}
            <button onClick={() => { setSearch(""); setMinPrice(""); setMaxPrice(""); setCategory(""); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Clear</button>
          </div>
          {showMessage && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-black text-[#FFD700] px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 opacity-100 animate-fade-in-out">
              {message}
            </div>
          )}
          <div ref={listRef}></div>
          {paginated.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <Link to={`/product/${item._id}`}>
                    <div className="relative overflow-hidden">
                      <img 
                        src={item.photos && item.photos[0] ? item.photos[0] : '/placeholder-image.jpg'} 
                        alt={item.name} 
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link to={`/product/${item._id}`}>  
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#F26A1B] transition-colors mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="text-2xl text-[#F26A1B] font-bold mb-4">
                      ₹{item.price?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <label className="text-sm text-gray-600 mr-2">Qty:</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="10"
                          value={quantities[item._id] || 1} 
                          onChange={e => setQuantities(q => ({ ...q, [item._id]: Math.max(1, parseInt(e.target.value) || 1) }))} 
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" 
                        />
                      </div>
                      <button 
                        onClick={() => handleAddToCart(item, quantities[item._id] || 1)} 
                        className="flex-1 bg-black text-[#FFD700] px-4 py-2 rounded-lg font-semibold hover:bg-[#F26A1B] hover:text-white transition-colors shadow-md hover:shadow-lg transition-all duration-300 focus:scale-95 active:scale-90"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center mt-8 gap-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Prev</button>
            <span className="px-4 py-2">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
          </div>
        </section>
      </div>
    </div>
  );
}