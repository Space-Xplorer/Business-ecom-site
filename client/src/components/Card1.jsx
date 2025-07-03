import React from 'react';

const Card1 = () => {
  return (
    <div className="relative w-full max-w-[600px] h-[400px] md:h-[450px] rounded-lg overflow-hidden shadow-lg">
      {/* Background image */}
      <img
        src="https://empress-clothing.com/cdn/shop/files/SL8412.jpg?v=1727850744"
        alt="Avni Kurta Set"
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Text content */}
      <div className="absolute bottom-6 left-6 text-white">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">AVNI</h2>
        <p className="text-base md:text-lg italic mt-1">Effortless Kurta Sets</p>
        <button className="mt-4 px-5 py-2 bg-white text-black text-sm md:text-base font-semibold rounded-full hover:bg-orange-200 transition duration-300 ease-in-out">
          EXPLORE NOW
        </button>
      </div>
    </div>
  );
};

export default Card1;
