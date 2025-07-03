import { useEffect, useState } from 'react';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carousel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/carousel');
        if (!response.ok) throw new Error('Failed to fetch slides');
        const data = await response.json();
        console.log("Fetched slides data:", data);
        setSlides(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        }
      }
    ]
  };

  if (loading) return <div className="text-center py-8 text-white">Loading carousel...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (slides.length === 0) return <div className="text-center py-8 text-white">No slides available</div>;

  return (
    <div className="w-full mx-auto relative">
      <Slider {...settings} className="carousel-container">
        {slides.map((slide, idx) => (
          <div key={idx} className="relative outline-none">
            <a href={slide.link} target="_blank" rel="noreferrer" className="block">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={slide.imageUrl}
                  alt={slide.altText || slide.title || 'Erimuga Carousel Slide'}
                  className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] object-cover"
                />
                {/* Overlay title at bottom center */}
                {slide.title && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 sm:px-6 sm:py-3 bg-black bg-opacity-70 text-white text-lg sm:text-xl md:text-2xl font-bold rounded shadow-lg text-center max-w-[90%] sm:max-w-xl">
                    {slide.title}
                  </div>
                )}
              </div>
            </a>
          </div>
        ))}
      </Slider>
      
      <style jsx>{`
        .carousel-container .slick-dots {
          bottom: -50px;
        }
        
        .carousel-container .slick-dots li button:before {
          color: #FFD700;
          font-size: 12px;
        }
        
        .carousel-container .slick-dots li.slick-active button:before {
          color: #F26A1B;
        }
        
        .carousel-container .slick-prev,
        .carousel-container .slick-next {
          z-index: 20;
          width: 40px;
          height: 40px;
        }
        
        .carousel-container .slick-prev {
          left: 20px;
        }
        
        .carousel-container .slick-next {
          right: 20px;
        }
        
        .carousel-container .slick-prev:before,
        .carousel-container .slick-next:before {
          font-size: 30px;
          color: #FFD700;
        }
        
        .carousel-container .slick-prev:hover:before,
        .carousel-container .slick-next:hover:before {
          color: #F26A1B;
        }
      `}</style>
    </div>
  );
}