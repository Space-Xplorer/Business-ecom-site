import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ApparelsPage() {
  // Placeholder data
  const featured = [
    { id: 1, name: "Muga Silk Saree", price: 4999, img: "https://source.unsplash.com/600x400/?saree,assam,1" },
    { id: 2, name: "Eri Shawl", price: 2499, img: "https://source.unsplash.com/600x400/?shawl,assam,2" },
    { id: 3, name: "Pat Mekhela Chador", price: 3999, img: "https://source.unsplash.com/600x400/?mekhela,chador,3" },
    { id: 4, name: "Traditional Gamusa", price: 499, img: "https://source.unsplash.com/600x400/?gamusa,assam,4" },
  ];
  const apparels = [
    ...featured,
    { id: 5, name: "Assamese Kurta", price: 1999, img: "https://source.unsplash.com/600x400/?kurta,assam,5" },
    { id: 6, name: "Handloom Stole", price: 1299, img: "https://source.unsplash.com/600x400/?stole,assam,6" },
    { id: 7, name: "Silk Dupatta", price: 1599, img: "https://source.unsplash.com/600x400/?dupatta,assam,7" },
    { id: 8, name: "Ethnic Jacket", price: 2999, img: "https://source.unsplash.com/600x400/?jacket,assam,8" },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] via-[#FFD700]/20 to-[#F26A1B]/10 relative overflow-x-hidden pb-16">
      {/* Assamese motif SVG background */}
      <svg className="absolute top-0 left-0 w-full h-32 opacity-10 z-0" viewBox="0 0 1440 320"><path fill="#FFD700" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <h1 className="text-5xl font-extrabold text-black mb-10 text-center tracking-wider drop-shadow">Apparels</h1>
        {/* Artistic Divider */}
        <div className="w-full flex justify-center mb-10">
          <div className="h-2 w-32 bg-gradient-to-r from-[#FFD700] via-[#F26A1B] to-[#FFD700] rounded-full shadow" />
        </div>
        {/* Carousel for featured apparels */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#F26A1B] mb-6 text-center drop-shadow">Featured Apparels</h2>
          <Slider {...sliderSettings}>
            {featured.map(item => (
              <div key={item.id} className="px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#FFD700]/40 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group relative">
                  <img src={item.img} alt={item.name} className="w-full h-72 object-cover group-hover:opacity-90" loading="lazy" />
                  <div className="p-6 text-center">
                    <span className="font-bold text-xl text-gray-900 group-hover:text-[#F26A1B] transition">{item.name}</span>
                    <div className="text-lg text-[#FFD700] font-semibold mt-2">₹{item.price}</div>
                    <Link to={`/products?featured=${item.id}`} className="inline-block mt-4 bg-black text-[#FFD700] px-5 py-2 rounded-lg font-medium hover:bg-[#F26A1B] hover:text-white transition shadow">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>
        {/* Artistic Divider */}
        <div className="w-full flex justify-center mb-10">
          <div className="h-2 w-32 bg-gradient-to-r from-[#FFD700] via-[#F26A1B] to-[#FFD700] rounded-full shadow" />
        </div>
        {/* Grid for all apparels */}
        <section>
          <h2 className="text-2xl font-bold text-black mb-6 text-center drop-shadow">All Apparels</h2>
          {/* Example: Map over apparels from backend */}
          {/* apparels.map(apparel => ( ... )) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {apparels.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-[#FFD700]/40 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group relative">
                <img src={item.img} alt={item.name} className="w-full h-56 object-cover group-hover:opacity-90" loading="lazy" />
                <div className="p-4 text-center">
                  <span className="font-bold text-lg text-gray-900 group-hover:text-[#F26A1B] transition">{item.name}</span>
                  <div className="text-md text-[#FFD700] font-semibold mt-1">₹{item.price}</div>
                  <Link to={`/products?apparel=${item.id}`} className="inline-block mt-3 bg-black text-[#FFD700] px-4 py-2 rounded-lg font-medium hover:bg-[#F26A1B] hover:text-white transition shadow">View</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 