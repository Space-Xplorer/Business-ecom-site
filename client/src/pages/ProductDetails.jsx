import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useState } from "react";

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

export default function ProductDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const product = productImages.find(p => p.name === decodeURIComponent(name));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button className="bg-[#F26A1B] text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition" onClick={() => navigate('/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

  const handleQty = (delta) => {
    setQty(q => Math.max(1, q + delta));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-0 flex flex-col md:flex-row md:items-start md:justify-center w-full">
      {/* Image Section */}
      <div className="flex-1 flex items-center justify-center bg-white md:rounded-none md:shadow-none md:border-r border-gray-200 p-8 min-h-[500px]">
        <img src={product.img} alt={product.name} className="w-full max-w-md h-[28rem] object-contain" onError={e => {e.target.src='/placeholder-image.jpg'}} />
      </div>
      {/* Details Section */}
      <div className="flex-1 flex flex-col justify-start bg-white p-8 min-h-[500px]">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
        <div className="text-3xl text-[#F26A1B] font-bold mb-4">₹{product.price.toLocaleString()}</div>
        <p className="text-gray-700 mb-8 text-lg">This is a beautiful Assamese textile product. Add a real description here to highlight its features, material, and story.</p>
        <div className="flex items-center gap-6 mb-8">
          <span className="text-gray-700 font-semibold text-lg">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button onClick={() => handleQty(-1)} className="px-4 py-2 text-2xl font-bold text-gray-700 hover:bg-gray-100">-</button>
            <span className="px-6 py-2 text-lg font-semibold bg-white select-none">{qty}</span>
            <button onClick={() => handleQty(1)} className="px-4 py-2 text-2xl font-bold text-gray-700 hover:bg-gray-100">+</button>
          </div>
        </div>
        <button onClick={() => addToCart({ ...product, id: product.name }, qty)} className="w-full bg-black text-[#FFD700] px-6 py-3 rounded-lg font-bold hover:bg-[#F26A1B] hover:text-white transition mb-4">Add to Cart</button>
        <button onClick={() => navigate('/products')} className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Back to Products</button>
      </div>
    </div>
  );
} 