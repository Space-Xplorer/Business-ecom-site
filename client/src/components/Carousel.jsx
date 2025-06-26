import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
  };

  if (loading) return <div className="text-center py-8">Loading carousel...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (slides.length === 0) return <div className="text-center py-8">No slides available</div>;

  return (
    <Slider {...settings}>
      {slides.map((slide, idx) => (
        <div key={idx}>
          <a href={slide.link} target="_blank" rel="noreferrer">
            <img
              src={slide.imageUrl}
              alt={slide.altText || slide.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </a>
        </div>
      ))}
    </Slider>
  );
}
