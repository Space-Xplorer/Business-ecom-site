import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const carouselItems = [
  {
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
    title: "Women's Dresses",
    link: "https://www.amazon.in/s?k=women+dresses"
  },
  {
    image: "https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
    title: "Men's Shirts",
    link: "https://www.amazon.in/s?k=men+shirts"
  },
  {
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
    title: "Kids' Collection",
    link: "https://www.amazon.in/s?k=kids+clothing"
  }
];

export default function LandingPage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 py-8">
          <Slider {...settings}>
            {carouselItems.map((item, idx) => (
              <div key={idx}>
                <a href={item.link} target="_blank" rel="noreferrer">
                  <img src={item.image} alt={item.title} className="w-full h-[400px] object-cover rounded-lg" />
                </a>
              </div>
            ))}
          </Slider>
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
