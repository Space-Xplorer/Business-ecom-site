import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] via-[#FFD700]/20 to-[#F26A1B]/10 relative overflow-x-hidden">
      {/* Assamese motif SVG background (subtle, decorative) */}
      <svg className="absolute top-0 left-0 w-full h-32 opacity-10 z-0" viewBox="0 0 1440 320"><path fill="#FFD700" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <h1 className="text-5xl font-extrabold text-black mb-10 text-center tracking-wider drop-shadow">About Us</h1>
        {/* Assamese Textiles Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#F26A1B] mb-3 border-l-4 border-[#FFD700] pl-3 drop-shadow">Assamese Textiles</h2>
          <p className="text-gray-700 text-lg leading-relaxed shadow-sm bg-white/80 rounded-lg p-4">
            Assamese textiles are renowned for their intricate handloom work, vibrant colors, and unique motifs. The region is famous for its <span className="font-semibold text-black">Muga silk</span>, <span className="font-semibold text-black">Eri silk</span>, and <span className="font-semibold text-black">Pat silk</span>, each with its own cultural significance and luxurious feel. Sarees, mekhela chador, and gamocha are some of the most cherished garments, reflecting Assam's rich heritage.
          </p>
        </section>
        {/* Artistic Divider */}
        <div className="w-full flex justify-center mb-12">
          <div className="h-2 w-32 bg-gradient-to-r from-[#FFD700] via-[#F26A1B] to-[#FFD700] rounded-full shadow" />
        </div>
        {/* Traditional Manufacturing Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#F26A1B] mb-3 border-l-4 border-[#FFD700] pl-3 drop-shadow">Traditional Manufacturing</h2>
          <p className="text-gray-700 text-lg leading-relaxed shadow-sm bg-white/80 rounded-lg p-4">
            The art of weaving in Assam is passed down through generations. Skilled artisans use traditional handlooms to create exquisite fabrics, often working from their homes or small community workshops. The process is sustainable, eco-friendly, and deeply rooted in Assamese culture.
          </p>
        </section>
        {/* Artistic Divider */}
        <div className="w-full flex justify-center mb-12">
          <div className="h-2 w-32 bg-gradient-to-r from-[#FFD700] via-[#F26A1B] to-[#FFD700] rounded-full shadow" />
        </div>
        {/* About Erimund Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-3 border-l-4 border-[#F26A1B] pl-3 drop-shadow">About Erimund</h2>
          <p className="text-gray-700 text-lg leading-relaxed shadow-sm bg-white/80 rounded-lg p-4">
            <span className="font-semibold text-black">Erimund</span> is dedicated to bringing the finest Assamese clothing and sarees to a global audience. We partner directly with weavers and trusted suppliers to ensure authenticity, quality, and fair trade. Our platform is a one-stop destination for those seeking genuine Assamese textiles, blending tradition with modern convenience.
          </p>
        </section>
        {/* Artistic Divider */}
        <div className="w-full flex justify-center mb-12">
          <div className="h-2 w-32 bg-gradient-to-r from-[#FFD700] via-[#F26A1B] to-[#FFD700] rounded-full shadow" />
        </div>
        {/* Mission/Values Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-black mb-3 border-l-4 border-[#FFD700] pl-3 drop-shadow">Our Mission & Values</h2>
          <ul className="list-disc pl-8 text-gray-700 text-lg bg-white/80 rounded-lg p-4 shadow-sm">
            <li>Empowering local artisans and preserving traditional crafts</li>
            <li>Offering only authentic, high-quality products</li>
            <li>Promoting sustainable and ethical fashion</li>
            <li>Delivering exceptional customer service</li>
          </ul>
        </section>
        <div className="text-center mt-12">
          <Link to="/" className="inline-block bg-black text-[#FFD700] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#F26A1B] hover:text-white transition shadow-lg tracking-wider">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 