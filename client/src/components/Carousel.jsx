import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Carousel() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetch('/api/carousel')
      .then(res => res.json())
      .then(data => setSlides(data));
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

  return (
    <Slider {...settings}>
      {slides.map((slide, idx) => (
        <div key={idx}>
          <a href={slide.link} target="_blank" rel="noreferrer">
            <img src={slide.imageUrl} alt={slide.altText || slide.title} className="w-full h-[400px] object-cover rounded-lg" />
          </a>
        </div>
      ))}
    </Slider>
  );
}
