import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { IoLogoYoutube } from "react-icons/io5";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Link } from "react-router-dom";

interface Slide {
  _id: string;
  title: string;
  description: string;
  image: string;
  overlayImages?: string[];
}

interface HeroSectionProps {
  isVisible: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isVisible }) => {
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/heroslides");
        if (!response.ok) throw new Error("Failed to fetch slides");
        const data: Slide[] = await response.json();
        setSlides(data);
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };
    fetchSlides();
  }, []);

  return (
    <div className="pt-20">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        className="h-[650px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[100%] overflow-hidden">
              <img
                src={slide.image}
                className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-10000 hover:scale-100"
                alt={slide.title}
                style={{ animation: 'gentleFloat 10s ease-in-out infinite' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
                <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
                  <div
                    className={`flex flex-col justify-center h-full max-w-2xl transition-all duration-1000 transform ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    }`}
                  >
                    <h1 className="text-8xl font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex space-x-6">
                      <Link to="/contact"  className="rounded-lg whitespace-nowrap px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        Book Now
                      </Link>
                      <button className="rounded-lg whitespace-nowrap px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 flex items-center justify-center gap-x-2 transform hover:scale-105 transition-all duration-300">
                        <IoLogoYoutube />
                        <span>Watch Videos</span>
                      </button>
                    </div>
                  </div>
                  <div className="relative w-[500px] h-[600px] hidden lg:block">
                    {slide.overlayImages?.map((img, index) => (
                      <div
                        key={index}
                        className="absolute w-[400px] h-[300px] rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:z-10"
                        style={{
                          top: `${index * 138}px`,
                          right: `${index * 25}px`,
                          zIndex: index,
                        }}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSection;
