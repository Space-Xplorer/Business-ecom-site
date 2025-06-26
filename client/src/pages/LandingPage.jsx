import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 py-8">
          <Carousel />
          <div className="mt-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to The Textile Store</h1>
            <p className="text-lg text-gray-700 mb-6">
              Discover the finest fabrics and collections for your wardrobe.
            </p>
            <Link
              to="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
