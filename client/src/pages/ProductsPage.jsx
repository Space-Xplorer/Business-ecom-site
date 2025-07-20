import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";

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
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({ subcategory: "", gender: "", price: "" });
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#F26A1B] transition-colors mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="text-2xl text-[#F26A1B] font-bold mb-4">
                      ₹{item.price.toLocaleString()}
                    </div>
                    
                    {/* Quantity and Add to Cart */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <label className="text-sm text-gray-600 mr-2">Qty:</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="10"
                          value={quantities[item.name] || 1} 
                          onChange={e => setQuantities(q => ({ ...q, [item.name]: Math.max(1, parseInt(e.target.value) || 1) }))} 
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#F26A1B]" 
                        />
                      </div>
                      <button 
                        onClick={() => addToCart({ ...item, id: item.name }, quantities[item.name] || 1)} 
                        className="flex-1 bg-black text-[#FFD700] px-4 py-2 rounded-lg font-semibold hover:bg-[#F26A1B] hover:text-white transition-colors shadow-md hover:shadow-lg"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}