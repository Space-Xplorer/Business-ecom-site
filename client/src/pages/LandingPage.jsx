import { Link } from "react-router-dom";
import Header from "../components/Header";
import Carousel from "../components/Carousel";

// Use real images for New Arrivals and Deals
const newArrivals = [
  { name: "Cotton Raw Silk", img: "/Cotton Raw Silk.jpg" },
  { name: "ERI SAREE COLOR V1", img: "/Home Page/ERI SAREE COLOR V1.jpg" },
  { name: "ERI SHAWL COLOR V1", img: "/Home Page/ERI SHAWL COLOR V1.jpg" },
  { name: "MugaSaree", img: "/Home Page/MugaSaree.jpg" },
];
const deals = [
  { name: "ERI ORGANIC DYE STOLE COLOR V1", img: "/Home Page/ERI ORGANIC DYE STOLE COLOR V1.jpg" },
  { name: "ERI STOLE - GENTS1", img: "/Home Page/ERI STOLE - GENTS1.jpg" },
  { name: "Cotton Raw Silk 2", img: "/Cotton Raw Silk 2.jpg" },
];

export default function LandingPage() {
  // Example: Fetch new arrivals from backend
  // useEffect(() => {
  //   fetch('http://localhost:8080/api/products/new-arrivals')
  //     .then(res => res.json())
  //     .then(data => setNewArrivals(data));
  // }, []);

  // Example: Fetch deals from backend
  // useEffect(() => {
  //   fetch('http://localhost:8080/api/products/deals')
  //     .then(res => res.json())
  //     .then(data => setDeals(data));
  // }, []);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-[#FFF8E1] via-[#FFD700]/20 to-[#F26A1B]/10 relative overflow-x-hidden">
      <svg className="absolute top-0 left-0 w-full h-40 opacity-10 z-0" viewBox="0 0 1440 320"><path fill="#FFD700" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
        {/* Hero Section: Carousel */}
        <section className="w-full bg-black flex flex-col items-center justify-center py-8 border-b-4 border-[#F26A1B] relative z-10 shadow-2xl">
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
            <Carousel />
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="container mx-auto px-4 py-10">
          <h2 className="text-3xl font-extrabold text-[#F26A1B] mb-6 text-center tracking-wider drop-shadow">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#FFD700]/40 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group relative">
                <img src={item.img} alt={item.name} className="w-full h-48 object-cover group-hover:opacity-90" />
                <div className="p-3 text-center">
                  <span className="font-semibold text-gray-800 text-lg group-hover:text-[#F26A1B] transition">{item.name}</span>
                </div>
                <div className="absolute top-2 right-2 bg-[#FFD700]/80 text-black text-xs px-2 py-1 rounded shadow">New</div>
              </div>
            ))}
          </div>
          {/* Example: Map over newArrivals from backend */}
          {/* newArrivals.map(product => ( ... )) */}
        </section>

        {/* Deals Section */}
        <section className="container mx-auto px-4 py-10">
          <h2 className="text-3xl font-extrabold text-black mb-6 text-center tracking-wider drop-shadow">Today's Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deals.map((item, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden shadow-lg border-2 border-[#FFD700]/40 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group">
                <img src={item.img} alt={item.name} className="w-full h-56 object-cover group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
                  <span className="text-lg font-bold text-[#FFD700] drop-shadow">{item.name}</span>
                  <p className="text-white text-sm">Save up to 30% on select Assamese textiles!</p>
                </div>
              </div>
            ))}
          </div>
          {/* Example: Map over deals from backend */}
          {/* deals.map(deal => ( ... )) */}
        </section>

        {/* What We Offer Section */}
        <section className="bg-[#FFD700]/30 py-12 mt-8 rounded-t-3xl border-t-4 border-[#F26A1B] shadow-inner">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-black mb-6 text-center tracking-wider drop-shadow">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow p-6 text-center border-2 border-[#FFD700]/40 hover:shadow-xl transition">
                <span className="text-4xl mb-2 inline-block">🛍️</span>
                <h3 className="font-bold text-lg mb-2">Authentic Assamese Textiles</h3>
                <p>Directly sourced from skilled artisans and trusted suppliers.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center border-2 border-[#FFD700]/40 hover:shadow-xl transition">
                <span className="text-4xl mb-2 inline-block">🚚</span>
                <h3 className="font-bold text-lg mb-2">Fast & Reliable Delivery</h3>
                <p>Nationwide shipping with secure packaging and tracking.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center border-2 border-[#FFD700]/40 hover:shadow-xl transition">
                <span className="text-4xl mb-2 inline-block">💳</span>
                <h3 className="font-bold text-lg mb-2">Easy Payments</h3>
                <p>Multiple payment options for a seamless shopping experience.</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link to="/about" className="inline-block bg-black text-[#FFD700] px-6 py-3 rounded-lg font-medium hover:bg-[#F26A1B] hover:text-white transition shadow-lg">Learn More About Us</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
