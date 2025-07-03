import { useState } from "react";
import { Link } from "react-router-dom";

// Use real product images and names from public folder
const productImages = [
  { name: "Cotton Raw Silk", img: "/Cotton Raw Silk.jpg", price: 1999 },
  { name: "Cotton Raw Silk 2", img: "/Cotton Raw Silk 2.jpg", price: 2099 },
  { name: "Cotton Raw Silk 3", img: "/Cotton Raw Silk 3.jpg", price: 2199 },
  { name: "Cotton Raw Silk 4", img: "/Cotton Raw Silk 4.jpg", price: 2299 },
  { name: "Cotton Raw Silk 5", img: "/Cotton Raw Silk 5.jpg", price: 2399 },
  { name: "Cotton Raw Silk 6", img: "/Cotton Raw Silk 6.jpg", price: 2499 },
  { name: "Cotton Raw Silk 7", img: "/Cotton Raw Silk 7.jpg", price: 2599 },
  { name: "Cotton Raw Silk 8", img: "/Cotton Raw Silk 8.jpg", price: 2699 },
  { name: "Cotton Raw Silk 9", img: "/Cotton Raw Silk 9.jpg", price: 2799 },
  { name: "ERI FIBRE STOLE COLOR V1", img: "/Home Page/ERI FIBRE STOLE COLOR V1.jpg", price: 1899 },
  { name: "ERI FIBRE STOLE COLOR V2", img: "/Home Page/ERI FIBRE STOLE COLOR V2.jpg", price: 1899 },
  { name: "ERI ORGANIC DYE STOLE COLOR V1", img: "/Home Page/ERI ORGANIC DYE STOLE COLOR V1.jpg", price: 1999 },
  { name: "ERI ORGANIC DYE STOLE COLOR V2", img: "/Home Page/ERI ORGANIC DYE STOLE COLOR V2.jpg", price: 1999 },
  { name: "ERI ORGANIC DYE STOLE COLOR V3", img: "/Home Page/ERI ORGANIC DYE STOLE COLOR V3.jpg", price: 1999 },
  { name: "ERI ORGANIC DYE STOLE COLOR V4", img: "/Home Page/ERI ORGANIC DYE STOLE COLOR V4.jpg", price: 1999 },
  { name: "ERI ORGANIC DYE STOLE COLOR V5", img: "/Home Page/ERI ORGANIC DYE STOLE COLOR V5.jpg", price: 1999 },
  { name: "ERI ORGANIC DYE STOLE COLOR V6", img: "/Home Page/ERI ORGANIC DYE STOLE COLOR V6.jpg", price: 1999 },
  { name: "ERI ORGANIC DYE STOLE COLOR V7", img: "/Home Page/ERI ORGANIC DYE STOLE COLOR V7.jpg", price: 1999 },
  { name: "ERI ORGANIC DYE STOLE COLOR V8", img: "/Home Page/ERI ORGANIC DYE STOLE COLOR V8.jpg", price: 1999 },
  { name: "ERI SAREE COLOR V1", img: "/Home Page/ERI SAREE COLOR V1.jpg", price: 2999 },
  { name: "ERI SAREE COLOR V2", img: "/Home Page/ERI SAREE COLOR V2.jpg", price: 2999 },
  { name: "ERI SAREE COLOR V3", img: "/Home Page/ERI SAREE COLOR V3.jpg", price: 2999 },
  { name: "ERI SAREE COLOR V4", img: "/Home Page/ERI SAREE COLOR V4.jpg", price: 2999 },
  { name: "ERI SAREE COLOR V5", img: "/Home Page/ERI SAREE COLOR V5.jpg", price: 2999 },
  { name: "ERI SAREE COLOR V6", img: "/Home Page/ERI SAREE COLOR V6.jpg", price: 2999 },
  { name: "ERI SHAWL COLOR V1", img: "/Home Page/ERI SHAWL COLOR V1.jpg", price: 2499 },
  { name: "ERI SHAWL COLOR V2", img: "/Home Page/ERI SHAWL COLOR V2.jpg", price: 2499 },
  { name: "ERI SHAWL COLOR V3", img: "/Home Page/ERI SHAWL COLOR V3.jpg", price: 2499 },
  { name: "ERI SHAWL COLOR V4", img: "/Home Page/ERI SHAWL COLOR V4.jpg", price: 2499 },
  { name: "ERI STOLE - GENTS1", img: "/Home Page/ERI STOLE - GENTS1.jpg", price: 1799 },
  { name: "ERI STOLE - GENTS2", img: "/Home Page/ERI STOLE - GENTS2.jpg", price: 1799 },
  { name: "Eri handwoven design shawls", img: "/Home Page/Eri handwoven design shawls.JPG", price: 2199 },
  { name: "MugaSaree", img: "/Home Page/MugaSaree.jpg", price: 3999 },
];

export default function ProductsPage() {
  const [filters, setFilters] = useState({ subcategory: "", gender: "", price: "" });
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [quantities, setQuantities] = useState({});

  // Add to cart handler
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(item => item.name === product.name);
      let updated;
      if (exists) {
        updated = prev.map(item =>
          item.name === product.name ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...prev, { ...product, quantity }];
      }
      localStorage.setItem('cartItems', JSON.stringify(updated));
      window.dispatchEvent(new Event('cartUpdated'));
      return updated;
    });
  };

  // Filter logic (placeholder, can be improved if you have categories)
  const filtered = productImages.filter(p =>
    (!filters.subcategory || p.name.toLowerCase().includes(filters.subcategory.toLowerCase())) &&
    (!filters.price || (filters.price === "low" ? p.price < 2000 : p.price >= 2000))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] via-[#FFD700]/20 to-[#F26A1B]/10 relative overflow-x-hidden pb-16">
      {/* Assamese motif SVG background */}
      <svg className="absolute top-0 left-0 w-full h-32 opacity-10 z-0" viewBox="0 0 1440 320"><path fill="#FFD700" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <h1 className="text-5xl font-extrabold text-black mb-10 text-center tracking-wider drop-shadow">Products</h1>
        {/* Artistic Divider */}
        <div className="w-full flex justify-center mb-10">
          <div className="h-2 w-32 bg-gradient-to-r from-[#FFD700] via-[#F26A1B] to-[#FFD700] rounded-full shadow" />
        </div>
        {/* Filters */}
        <section className="mb-10 flex flex-col md:flex-row gap-6 items-center justify-center">
          <input className="px-4 py-2 rounded-lg border-2 border-[#FFD700]/40 bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#F26A1B] text-lg" placeholder="Search by name..." value={filters.subcategory} onChange={e => setFilters(f => ({ ...f, subcategory: e.target.value }))} />
          <select className="px-4 py-2 rounded-lg border-2 border-[#FFD700]/40 bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#F26A1B] text-lg" value={filters.price} onChange={e => setFilters(f => ({ ...f, price: e.target.value }))}>
            <option value="">All Prices</option>
            <option value="low">Below ₹2000</option>
            <option value="high">₹2000 & Above</option>
          </select>
        </section>
        {/* Artistic Divider */}
        <div className="w-full flex justify-center mb-10">
          <div className="h-2 w-32 bg-gradient-to-r from-[#FFD700] via-[#F26A1B] to-[#FFD700] rounded-full shadow" />
        </div>
        {/* Product Grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-[#FFD700]/40 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group relative w-full" style={{ aspectRatio: '3/4', minHeight: '320px', maxWidth: '320px', margin: '0 auto' }}>
                <img src={item.img} alt={item.name} className="w-full h-56 object-cover group-hover:opacity-90" style={{ aspectRatio: '3/4', width: '100%', height: '260px', objectFit: 'cover' }} />
                <div className="p-4 text-center">
                  <span className="font-bold text-lg text-gray-900 group-hover:text-[#F26A1B] transition">{item.name}</span>
                  <div className="text-md text-[#FFD700] font-semibold mt-1">₹{item.price}</div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <input type="number" min="1" value={quantities[item.name] || 1} onChange={e => setQuantities(q => ({ ...q, [item.name]: parseInt(e.target.value) }))} className="w-16 px-2 py-1 border rounded" />
                    <button onClick={() => addToCart(item, quantities[item.name] || 1)} className="inline-block bg-black text-[#FFD700] px-4 py-2 rounded-lg font-medium hover:bg-[#F26A1B] hover:text-white transition shadow">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 