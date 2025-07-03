import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductsPage() {
  // Example: Fetch products from backend
  // useEffect(() => {
  //   fetch('http://localhost:8080/api/products')
  //     .then(res => res.json())
  //     .then(data => setProducts(data));
  // }, []);

  // Placeholder data
  const [filters, setFilters] = useState({ subcategory: "", gender: "", price: "" });
  const products = [
    { id: 1, name: "Muga Silk Saree", price: 4999, img: "https://source.unsplash.com/400x400/?saree,assam,1", gender: "Women", subcategory: "Saree" },
    { id: 2, name: "Eri Shawl", price: 2499, img: "https://source.unsplash.com/400x400/?shawl,assam,2", gender: "Unisex", subcategory: "Shawl" },
    { id: 3, name: "Pat Mekhela Chador", price: 3999, img: "https://source.unsplash.com/400x400/?mekhela,chador,3", gender: "Women", subcategory: "Mekhela Chador" },
    { id: 4, name: "Traditional Gamusa", price: 499, img: "https://source.unsplash.com/400x400/?gamusa,assam,4", gender: "Unisex", subcategory: "Gamusa" },
    { id: 5, name: "Assamese Kurta", price: 1999, img: "https://source.unsplash.com/400x400/?kurta,assam,5", gender: "Men", subcategory: "Kurta" },
    { id: 6, name: "Handloom Stole", price: 1299, img: "https://source.unsplash.com/400x400/?stole,assam,6", gender: "Women", subcategory: "Stole" },
    { id: 7, name: "Silk Dupatta", price: 1599, img: "https://source.unsplash.com/400x400/?dupatta,assam,7", gender: "Women", subcategory: "Dupatta" },
    { id: 8, name: "Ethnic Jacket", price: 2999, img: "https://source.unsplash.com/400x400/?jacket,assam,8", gender: "Men", subcategory: "Jacket" },
  ];

  // Filter logic (placeholder)
  const filtered = products.filter(p =>
    (!filters.subcategory || p.subcategory === filters.subcategory) &&
    (!filters.gender || p.gender === filters.gender) &&
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
          <select className="px-4 py-2 rounded-lg border-2 border-[#FFD700]/40 bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#F26A1B] text-lg" value={filters.subcategory} onChange={e => setFilters(f => ({ ...f, subcategory: e.target.value }))}>
            <option value="">All Subcategories</option>
            <option value="Saree">Saree</option>
            <option value="Shawl">Shawl</option>
            <option value="Mekhela Chador">Mekhela Chador</option>
            <option value="Gamusa">Gamusa</option>
            <option value="Kurta">Kurta</option>
            <option value="Stole">Stole</option>
            <option value="Dupatta">Dupatta</option>
            <option value="Jacket">Jacket</option>
          </select>
          <select className="px-4 py-2 rounded-lg border-2 border-[#FFD700]/40 bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#F26A1B] text-lg" value={filters.gender} onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))}>
            <option value="">All Genders</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
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
          {/* Example: Map over products from backend */}
          {/* products.map(product => ( ... )) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-[#FFD700]/40 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group relative">
                <img src={item.img} alt={item.name} className="w-full h-56 object-cover group-hover:opacity-90" />
                <div className="p-4 text-center">
                  <span className="font-bold text-lg text-gray-900 group-hover:text-[#F26A1B] transition">{item.name}</span>
                  <div className="text-md text-[#FFD700] font-semibold mt-1">₹{item.price}</div>
                  <button className="inline-block mt-3 bg-black text-[#FFD700] px-4 py-2 rounded-lg font-medium hover:bg-[#F26A1B] hover:text-white transition shadow">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 