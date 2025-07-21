import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !product) {
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

  const handleAddToCart = () => {
    addToCart({ ...product, id: product._id }, qty);
    setMessage(`${product.name} added to cart!`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-0 flex flex-col md:flex-row md:items-start md:justify-center w-full">
      {showMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-black text-[#FFD700] px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 opacity-100 animate-fade-in-out">
          {message}
        </div>
      )}
      {/* Image Section */}
      <div className="flex-1 flex items-center justify-center bg-white md:rounded-none md:shadow-none md:border-r border-gray-200 p-8 min-h-[500px]">
        <img src={product.photos && product.photos[0] ? product.photos[0] : '/placeholder-image.jpg'} alt={product.name} className="w-full max-w-md h-[28rem] object-contain" loading="lazy" onError={e => {e.target.src='/placeholder-image.jpg'}} />
      </div>
      {/* Details Section */}
      <div className="flex-1 flex flex-col justify-start bg-white p-8 min-h-[500px]">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
        <div className="text-3xl text-[#F26A1B] font-bold mb-4">₹{product.price?.toLocaleString()}</div>
        <p className="text-gray-700 mb-8 text-lg">{product.description || "This is a beautiful Assamese textile product. Add a real description here to highlight its features, material, and story."}</p>
        <div className="flex items-center gap-6 mb-8">
          <span className="text-gray-700 font-semibold text-lg">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button onClick={() => handleQty(-1)} className="px-4 py-2 text-2xl font-bold text-gray-700 hover:bg-gray-100">-</button>
            <span className="px-6 py-2 text-lg font-semibold bg-white select-none">{qty}</span>
            <button onClick={() => handleQty(1)} className="px-4 py-2 text-2xl font-bold text-gray-700 hover:bg-gray-100">+</button>
          </div>
        </div>
        <button onClick={handleAddToCart} className="w-full bg-black text-[#FFD700] px-6 py-3 rounded-lg font-bold hover:bg-[#F26A1B] hover:text-white transition mb-4 transition-all duration-300 focus:scale-95 active:scale-90">Add to Cart</button>
        <button onClick={() => navigate('/products')} className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Back to Products</button>
      </div>
    </div>
  );
} 